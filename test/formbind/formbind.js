import { Model, Collection, ajax } from '../../nextbone';
import { formBind } from '../../formbind';
import { clone, uniq } from 'underscore';
import {fixture, defineCE} from '@open-wc/testing-helpers';
import {LitElement, html} from 'lit-element';

import { expect } from 'chai';
import { stub, spy, assert, match } from 'sinon';

@formBind
class TestDefaultInputs extends LitElement {
  createRenderRoot() {
    return this
  }

  render() {
    return html`
      <input type="text" name="textProp"/>
      <input type="number" name="numberProp"/>
      <input type="radio" name="radioProp" value="a"/>
      <input type="radio" name="radioProp" value="b" checked/>
      <select name="selectProp">
        <option value="xx">XX</option>
        <option selected value="yy">YY</option>
      </select>
    `
  }
}

const defaultsTag = defineCE(TestDefaultInputs)

describe('formBind', function() {
  let myModel;
  let setSpy;

  beforeEach(function() {
    myModel = new Model();
    setSpy = spy(myModel, 'set')
  });

  afterEach(function() {
    myModel = null;
  });

  describe('with default inputs', function() {
    let el
    beforeEach(async function () {
      el = await fixture(`<${defaultsTag}></${defaultsTag}>`);
      el.model = myModel
      await el.updateComplete
    })

    it('should handle input event for generic input', async function() {      
      const inputEl = el.renderRoot.querySelector('input[type="text"]')
      inputEl.value = 'zzz'
      inputEl.dispatchEvent(new InputEvent('input', {bubbles: true}))
      assert.calledOnce(setSpy)
      assert.calledWith(setSpy, 'textProp', 'zzz', match({validate: true, attributes: ['textProp']}))
    });

    it('should handle input event for select', async function() {      
      const inputEl = el.renderRoot.querySelector('select')
      inputEl.dispatchEvent(new InputEvent('input', {bubbles: true}))
      assert.calledOnce(setSpy)
      assert.calledWith(setSpy, 'selectProp', 'yy', match({validate: true, attributes: ['selectProp']}))
      setSpy.resetHistory()

      const optionEl = el.renderRoot.querySelector('option:first-child')
      optionEl.selected = true
      inputEl.dispatchEvent(new InputEvent('input', {bubbles: true}))
      assert.calledOnce(setSpy)
      assert.calledWith(setSpy, 'selectProp', 'xx', match({validate: true, attributes: ['selectProp']}))
    });

    it('should handle change event for radio input', async function() {      
      let inputEl = el.renderRoot.querySelector('input[type="radio"][checked]')
      inputEl.dispatchEvent(new InputEvent('change', {bubbles: true}))
      assert.calledOnce(setSpy)
      assert.calledWith(setSpy, 'radioProp', 'b', match({validate: true, attributes: ['radioProp']}))
      setSpy.resetHistory()

      inputEl = el.renderRoot.querySelector('input[type="radio"]:not([checked])')
      inputEl.dispatchEvent(new InputEvent('change', {bubbles: true}))
      assert.calledOnce(setSpy)
      assert.calledWith(setSpy, 'radioProp', 'a', match({validate: true, attributes: ['radioProp']}))
    });

    it('should convert value to number for number input', async function() {      
      const inputEl = el.renderRoot.querySelector('input[type="number"]')
      inputEl.value = '3'
      inputEl.dispatchEvent(new InputEvent('input', {bubbles: true}))
      assert.calledOnce(setSpy)
      assert.calledWith(setSpy, 'numberProp', 3, match({validate: true, attributes: ['numberProp']}))
    });
  });
});




