const Entities = require('html-entities').AllHtmlEntities;
const entities = new Entities();

const HtmlEntitiesAmpersand = {
	regex: /(&[^\=]*?;)/g,
	decode: function (inputText) {
		var matches = [];
		while (match = this.regex.exec(inputText)) {
			matches.push(match);
		}
		var i = 0;
    var result = inputText;
		while (i < matches.length) {
      var value = matches[i][0];
      var newValue = entities.decode(value);
      result = result.replace(value, newValue);
      i++;
    }
    return result;
	},
};

// var string = `&copy;`;

// console.log(HtmlEntitiesAmpersand.decode(string));
module.exports = HtmlEntitiesAmpersand;