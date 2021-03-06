import { moduleForProperty } from '../../../helpers/properties';
import { create, value } from 'ember-cli-page-object';

moduleForProperty('value', function(test) {
  test('returns the text of the input', function(assert) {
    let page = create({
      foo: value('input')
    });

    this.adapter.createTemplate(this, page, '<input value="Lorem ipsum">');

    assert.equal(page.foo, 'Lorem ipsum');
  });

  test('returns the html of the contenteditable', function(assert) {
    let page = create({
      foo: value('[contenteditable]')
    });

    this.adapter.createTemplate(this, page, '<div contenteditable="true"><b>Lorem ipsum</b></div>');

    assert.equal(page.foo, '<b>Lorem ipsum</b>');
  });

  test('returns empty when the element doesn\'t have value attribute and is not contenteditable', function(assert) {
    let page = create({
      foo: value('input')
    });

    this.adapter.createTemplate(this, page, '<input>');

    assert.equal(page.foo, '');
  });

  test("raises an error when the element doesn't exist", function(assert) {
    let page = create({
      foo: {
        bar: {
          baz: {
            qux: value('input')
          }
        }
      }
    });

    this.adapter.createTemplate(this, page);

    assert.throws(() => page.foo.bar.baz.qux, /page\.foo\.bar\.baz\.qux/);
  });

  test('looks for elements inside the scope', function(assert) {
    let page = create({
      foo: value('input', { scope: '.scope' })
    });

    this.adapter.createTemplate(this, page, `
      <div><input value="lorem"></div>
      <div class="scope"><input value="ipsum"></div>
    `);

    assert.equal(page.foo, 'ipsum');
  });

  test("looks for elements inside page's scope", function(assert) {
    let page = create({
      scope: '.scope',

      foo: value('input')
    });

    this.adapter.createTemplate(this, page, `
      <div><input value="lorem"></div>
      <div class="scope"><input value="ipsum"></div>
    `);

    assert.equal(page.foo, 'ipsum');
  });

  test('resets scope', function(assert) {
    let page = create({
      scope: '.scope',

      foo: value('input', { at: 0, resetScope: true })
    });

    this.adapter.createTemplate(this, page, `
      <div><input value="lorem"></div>
      <div class="scope"><input value="ipsum"></div>
    `);

    assert.equal(page.foo, 'lorem');
  });

  test('throws error if selector matches more than one element', function(assert) {
    let page = create({
      foo: value('input')
    });

    this.adapter.createTemplate(this, page, `
      <input value="lorem">
      <input value="ipsum">
    `);

    assert.throws(() => page.foo,
      /matched more than one element. If this is not an error use { multiple: true }/);
  });

  test('matches multiple elements with multiple: true option', function(assert) {
    let page = create({
      foo: value('input', { multiple: true })
    });

    this.adapter.createTemplate(this, page, `
      <input value="lorem">
      <input value="ipsum">
    `);

    assert.deepEqual(page.foo, ['lorem', 'ipsum']);
  });

  test('finds element by index', function(assert) {
    let page = create({
      foo: value('input', { at: 1 })
    });

    this.adapter.createTemplate(this, page, `
      <input value="lorem">
      <input value="ipsum">
    `);

    assert.equal(page.foo, 'ipsum');
  });

  test('looks for elements within test container specified at the property', function(assert) {
    let page = create({
      foo: value('input', { testContainer: '#alternate-ember-testing' })
    });

    this.adapter.createTemplate(this, page, '<input value="lorem">', { useAlternateContainer: true });

    assert.equal(page.foo, 'lorem');
  });

  test('looks for elements within test container specified at the node', function(assert) {
    let page = create({
      testContainer: '#alternate-ember-testing',
      foo: value('input')
    });

    this.adapter.createTemplate(this, page, '<input value="lorem">', { useAlternateContainer: true });

    assert.equal(page.foo, 'lorem');
  });
});
