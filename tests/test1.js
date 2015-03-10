describe("We are testing F", function() {
  it('F["+"](5,3) === 5+3', function() {
    expect(F["+"](5,3)).toBe(5+3);
  });
  
  it('F["/"](5,3) === 5/3', function() {
    expect(F["/"](5,3)).toBe(5/3);
  });
});