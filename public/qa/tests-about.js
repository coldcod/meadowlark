suite("Tests About", function(){
  test('link to the contact page is working', function(){
    assert($('a[href="/contact"]').length);
  })
})
