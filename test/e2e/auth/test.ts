describe('Sample Test', () => {
  beforeAll(() => {
    console.log('✅ Outer before all');
  });

  beforeEach(() => {
    console.log('✅ Outer before each');
  });

  describe('sample test', () => {
    beforeAll(() => {
      console.log('✅ Inner before all');
    });
    beforeEach(() => {
      console.log('✅ Inner before Each');
    });
    test('test1', () => {
      console.log('✅ Sample test1');
      expect(true).toBe(true);
    });
    test('test2', () => {
      console.log('✅ Sample test2');
      expect(true).toBe(true);
    });
  });

  afterEach(() => {
    console.log('✅ Outer after each');
  });

  afterAll(() => {
    console.log('✅ Outer after all');
  });
});
