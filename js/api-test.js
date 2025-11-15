
const APITester = {
  async testCoursesAPI() {
    console.log('Testing Courses API...');
    try {
      const response = await fetch('data/courses.json');
      const data = await response.json();
      console.log('✓ Courses API working', data);
      return data;
    } catch (error) {
      console.error('✗ Courses API failed:', error);
      return null;
    }
  },

  async testUniversity1API() {
    console.log('Testing University 1 API...');
    try {
      const response = await fetch('data/university1-info.json');
      const data = await response.json();
      console.log('✓ University 1 API working', data);
      return data;
    } catch (error) {
      console.error('✗ University 1 API failed:', error);
      return null;
    }
  },

  async testUniversity2API() {
    console.log('Testing University 2 API...');
    try {
      const response = await fetch('data/university2-info.json');
      const data = await response.json();
      console.log('✓ University 2 API working', data);
      return data;
    } catch (error) {
      console.error('✗ University 2 API failed:', error);
      return null;
    }
  },

  testValidation() {
    console.log('Testing Validation Functions...');
    const tests = [
      {
        name: 'Valid Phone',
        fn: () => window.formUtils.validatePhone('9876543210'),
        expected: true
      },
      {
        name: 'Invalid Phone (too short)',
        fn: () => window.formUtils.validatePhone('987654'),
        expected: false
      },
      {
        name: 'Valid Email',
        fn: () => window.formUtils.validateEmail('test@example.com'),
        expected: true
      },
      {
        name: 'Invalid Email',
        fn: () => window.formUtils.validateEmail('notanemail'),
        expected: false
      },
      {
        name: 'Valid Form Data',
        fn: () => {
          const errors = window.formUtils.validateFormData({
            fullName: 'John Doe',
            email: 'john@example.com',
            phone: '9876543210',
            state: 'Delhi',
            course: 'B.Tech',
            intake: '2025',
            consent: true
          });
          return Object.keys(errors).length === 0;
        },
        expected: true
      }
    ];

    tests.forEach(test => {
      const result = test.fn();
      const status = result === test.expected ? '✓' : '✗';
      console.log(`${status} ${test.name}: ${result}`);
    });
  },

  async runAllTests() {
    console.log('=== Running All API Tests ===');
    await this.testCoursesAPI();
    await this.testUniversity1API();
    await this.testUniversity2API();
    this.testValidation();
    console.log('=== All Tests Complete ===');
  }
};

// Usage: APITester.runAllTests();
