const WEBHOOK_URL = 'https://eoevz7vuaaxyesl.m.pipedream.net'; 

document.addEventListener('DOMContentLoaded', async () => {
   
    await loadCoursesData();
    await loadUniversityInfoAndDisplay(); 
    await populateFormSelects();
    
    document.getElementById('admissionForm').addEventListener('submit', handleFormSubmit);
    document.getElementById('downloadBrochure')?.addEventListener('click', downloadBrochure);
});

function getUniversityInfoFile() {
    const currentFile = window.location.pathname.split('/').pop() || 'index.html';
    
    if (currentFile.includes('university2')) {
        return 'data/university2-info.json'; // Chandigarh University
    }
    return 'data/university1-info.json'; // LPU (Default)
}

async function loadCoursesData() {
    try {
        const response = await fetch('data/courses.json');
        if (!response.ok) throw new Error('Failed to fetch courses.json');
        const data = await response.json();
        
        const coursesContainer = document.getElementById('coursesContainer');
        if (coursesContainer) {
            coursesContainer.innerHTML = data.courses.map(course => `
                <div class="col-md-6 col-lg-4">
                    <div class="program-card">
                        <div class="program-card-top">
                            <div class="program-card-duration">${course.duration}</div>
                            <h3 class="program-card-title">${course.name}</h3>
                        </div>
                        <div class="program-card-bottom">
                            <div class="program-card-logo">
                                <i class="fas fa-book"></i> 
                            </div>
                            <div class="program-card-department">
                                ${window.formUtils.formatCurrency(course.fee.min)} - ${window.formUtils.formatCurrency(course.fee.max)}
                            </div>
                        </div>
                    </div>
                </div>
            `).join('');
        }
    } catch (error) {
        console.error('Error loading courses:', error);
    }
}

async function loadUniversityInfoAndDisplay() {
    try {
        const infoFile = getUniversityInfoFile();

        const response = await fetch(infoFile);
        if (!response.ok) throw new Error(`Failed to fetch ${infoFile}`);
        const data = await response.json();
        const uni = data.university;
        
        document.getElementById('placementPercentage').textContent = uni.placements.placed_percentage;
        document.getElementById('avgPackage').textContent = uni.placements.average_package;
        document.getElementById('highestPackage').textContent = uni.placements.highest_package;
        document.getElementById('topRecruiters').textContent = uni.placements.top_recruiters.length + '+';
        
        const carouselInner = document.getElementById('recruiterCarouselInner');
        if (carouselInner) {
            const recruiters = uni.placements.top_recruiters;
            const chunkSize = 6; 
            let carouselHTML = '';

            for (let i = 0; i < recruiters.length; i += chunkSize) {
                const chunk = recruiters.slice(i, i + chunkSize);
                const activeClass = (i === 0) ? 'active' : ''; 

                carouselHTML += `<div class="carousel-item ${activeClass}">`;
                carouselHTML += `<div class="recruiter-logo-group">`;

                chunk.forEach(recruiter => {
                    const domain = recruiter.toLowerCase().replace(/ /g, '').replace(/\./g, '') + '.com';
                    const logoUrl = `https://logo.clearbit.com/${domain}`;
                    
                    carouselHTML += `
                        <div class="recruiter-item-card">
                            <img src="${logoUrl}" 
                                 alt="${recruiter} logo" 
                                 class="recruiter-logo" 
                                 title="${recruiter}" 
                                 onerror="this.style.display='none'; this.nextElementSibling.style.display='block';">
                            <span class="recruiter-text" style="display: none;">${recruiter}</span>
                        </div>
                    `;
                });

                carouselHTML += `</div></div>`;
            }
            carouselInner.innerHTML = carouselHTML;
        }
        
        const facilitiesContainer = document.getElementById('facilitiesContainer');
        if (facilitiesContainer) {
            facilitiesContainer.innerHTML = uni.facilities.map((facility, index) => {
                const icons = ['fa-microscope', 'fa-book', 'fa-dumbbell', 'fa-bed', 'fa-lightbulb', 'fa-wifi'];
                return `
                    <div class="col-md-6 col-lg-4 d-flex justify-content-center">
                        <div class="facilities-card">
                            <i class="fas ${icons[index] || 'fa-star'} text-primary"></i>
                            <h5 class="card-title">${facility.name}</h5>
                            <p class="card-text text-muted">${facility.description}</p>
                        </div>
                    </div>
                `;
            }).join('');
        }
    } catch (error) {
        console.error('Error loading university info:', error);
    }
}


async function loadFeesModal() {
    try {
        const response = await fetch('data/courses.json');
        if (!response.ok) throw new Error('Failed to fetch courses.json for fees');
        const data = await response.json();
        
        const table = `
            <table class="table table-hover">
                <thead>
                    <tr>
                        <th>Course Name</th>
                        <th>Duration</th>
                        <th>Min Fee (Annual)</th>
                        <th>Max Fee (Annual)</th>
                    </tr>
                </thead>
                <tbody>
                    ${data.courses.map(course => `
                        <tr>
                            <td><strong>${course.name}</strong></td>
                            <td>${course.duration}</td>
                            <td>${window.formUtils.formatCurrency(course.fee.min)}</td>
                            <td>${window.formUtils.formatCurrency(course.fee.max)}</td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        `;
        
        document.getElementById('feesTableContainer').innerHTML = table;
    } catch (error) {
        console.error('Error loading fees:', error);
    }
}

function populateFormSelects() {
    
    const stateSelect = document.getElementById('state');
    if (stateSelect) {
        stateSelect.innerHTML += window.formUtils.IndianStates.map(state => 
            `<option value="${state}">${state}</option>`
        ).join('');
    }
    
    const courseSelect = document.getElementById('course');
    if (courseSelect) {
        courseSelect.innerHTML += window.formUtils.courses.map(course => 
            `<option value="${course}">${course}</option>`
        ).join('');
    }
    
    const intakeSelect = document.getElementById('intake');
    if (intakeSelect) {
        intakeSelect.innerHTML += window.formUtils.intakeYears.map(year => 
            `<option value="${year}">${year}</option>`
        ).join('');
    }
    
    document.getElementById('feesModal')?.addEventListener('show.bs.modal', loadFeesModal);
}

async function handleFormSubmit(e) {
    e.preventDefault();
    
    const formData = {
        fullName: document.getElementById('fullName').value,
        email: document.getElementById('email').value,
        phone: document.getElementById('phone').value,
        state: document.getElementById('state').value,
        course: document.getElementById('course').value,
        intake: document.getElementById('intake').value,
        consent: document.getElementById('consent').checked,
        submittedAt: new Date().toISOString()
    };
    
    const errors = window.formUtils.validateFormData(formData);
    
    document.querySelectorAll('.text-danger').forEach(el => el.classList.add('d-none'));
    
    if (Object.keys(errors).length > 0) {
        Object.entries(errors).forEach(([field, message]) => {
            const errorEl = document.getElementById(`${field}Error`);
            if (errorEl) {
                errorEl.textContent = message;
                errorEl.classList.remove('d-none');
            }
        });
        return; 
    }
    
    const success = await window.formUtils.submitFormToPipedream(formData, WEBHOOK_URL);
    
    if (success) {
        document.getElementById('admissionForm').reset();
        window.formUtils.showNotification('Application submitted successfully!', 'success');
    }
}

async function downloadBrochure() {
    try {
        const infoFile = getUniversityInfoFile();
        
        const uniResponse = await fetch(infoFile);
        if (!uniResponse.ok) throw new Error(`Failed to fetch ${infoFile}`);
        const uniData = await uniResponse.json();
        const uni = uniData.university;

        const courseResponse = await fetch('data/courses.json');
        if (!courseResponse.ok) throw new Error('Failed to fetch courses.json');
        const courseData = await courseResponse.json();

        const brochureContent = `
${uni.name.toUpperCase()} - ACADEMIC BROCHURE 2024-2025

Institution Overview:
${uni.about}

Programs Offered:
${courseData.courses.map(course => `- ${course.name} (${course.duration})`).join('\n')}

Placement Statistics:
- Placement Rate: ${uni.placements.placed_percentage}
- Average Package: ${uni.placements.average_package}
- Highest Package: ${uni.placements.highest_package}
- Top Recruiters: ${uni.placements.top_recruiters.length}+

For more information, visit: ${uni.website || 'N/A'}
Contact: ${uni.contact.email || 'N/A'}
`;

        const element = document.createElement('a');
        element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(brochureContent));
        element.setAttribute('download', `${uni.name.replace(/ /g, '-')}-Brochure.txt`);
        element.style.display = 'none';
        document.body.appendChild(element);
        element.click();
        document.body.removeChild(element);
        
        window.formUtils.showNotification('Brochure downloaded successfully!', 'success');
    } catch (error) {
        console.error('Error downloading brochure:', error);
        window.formUtils.showNotification('Could not download brochure. Data missing.', 'error');
    }
}