describe('Hello World', () => {
  beforeEach(async () => {
    await device.reloadReactNative();
  });

  it('should have onboarding screen', async () => {
    await expect(element(by.id('onboarding'))).toBeVisible();
  });
});
