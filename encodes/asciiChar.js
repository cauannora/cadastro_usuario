const asciiChar = {
	regex: /char\(([\d\D]*?)\)/g,
	decode: function (inputText) {
        var matches = [];
        while (match = this.regex.exec(inputText)) {
            matches.push(match);   
		}
		var i = 0;
		console.log('===========================');
		while(i < matches.length) {
            var split = matches[i][1].split(',');
            console.log(split)
            var char = '';
            for (let j = 0; j < split.length; j++) {
                char = char.concat(String.fromCharCode(split[j]));
            }
            inputText = inputText.replace(matches[i][0], char);
			console.log(char);
			i++;
		}
		console.log('===========================\n');
		return inputText;
	},
};
var string = 
`2019-06-14 00:12:09 177.159.71.181 POST /principal/myService/inter/cadastro.php ed=(SeLeCt+1+FrOm(SeLeCt+count(*),CoNcAt((SeLeCt(SeLeCt+UnHeX(HeX(CoNcAt(char(33),0x4142433134355a5136324457514146504f4959434644,char(33,126,33)))))+FrOm+information_schema.TaBlEs+LiMiT+0,1),floor(rand(0)*2))x+FrOm+information_schema.TaBlEs+GrOuP+By+x)a)&negocio=GO|0|80020009|Either_BOF_or_EOF_is_True__or_the_current_record_has_been_deleted._Requested_operation_requires_a_current_record. 500 89 16 www.enterprise.com Mozilla/5.0+(Windows;+U;+Windows+NT+5.1;+pt-PT;+rv:1.9.1.2)+Gecko/20090729+Firefox/3.5.2+(.NET+CLR+3.5.30729)`

console.log(asciiChar.decode(string));