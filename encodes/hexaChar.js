const hexaChar = {
	regex: /0x([A-Fa-f0-9]*)?/g,
	decode: function (inputText) {
		var matches = [];
		while (match = this.regex.exec(inputText)) {
			matches.push(match);
		}
		var i = 0;
		console.log(inputText);
		while (i < matches.length) {
			if (matches[i][1] === undefined) {
				inputText = inputText.replace(matches[i][0], '');
				i++;
				continue;
			}
			var result = '';
			console.log('Texto ofuscado: ' + matches[i][1]);
			if (matches[i][1].length > 2) { //Verifica se o valor lido no RegExp tem mais de 2 caracteres, se sim, segue quebrando o valor de 2 em 2 na ordem invertida.

				var subString = matches[i][1]; //Os valores depois do 0x do RegExp (Ex: '303536')
				var reverseSubString = subString.split("").reverse().join("");//Quebra o valor caracter a caracter, inverte o array de split, depois junta. 'Ex: 303536' -> [3, 0, 3, 5, 3, 6] -> [6, 3, 5, 3, 0, 3] -> '635303'
				result = reverseSubString; //inicia o resultado com o valor do invertido(Ex:'635303').

				for (var j = 0 ; j < reverseSubString.length; j+=2) { //Itera o texto a cada 2 caracteres.

					var reverseValue = reverseSubString.substr(j, 2);//Seleciona 2 caracteres do texto (Ex: '635303' -> '63').
					var value = reverseValue[1].concat(reverseValue[0]); //Inverte o valor para a ordem certa (Ex: '63' -> '36').
					var newValue = String.fromCharCode(parseInt(value, 16)); //Converte o valor hex para texto (Ex: '36' -> '6').
					result = result.replace(reverseValue, newValue); //Substitui na String result o valor traduzido (Ex: result = '635303' -> '65303').
				}

				result = result.split("").reverse().join(""); //Quebra o valor caracter a caracter, inverte o array de split, depois junta. 'Ex: 650' -> [6, 5, 0] -> [0, 5, 6] -> '056'.
				console.log('Texto desofuscado: ' + result);
				inputText = inputText.replace(matches[i][0], result); //Por fim pega a o resultado da RegExp do começo e substitui pelo result (Ext: '303536' -> '056').
			} else { //Se não, traduz diretamente. (Ex: '36').

				var newValue = String.fromCharCode(matches[i][0]); //Traduz o valor hex para texto (Ex: '0x36' -> '6'). 
				inputText = inputText.replace(matches[i][0], newValue); //Substitui no resultado do RegExp pelo valor traduzido (Ex: '36' -> '6').
				result = newValue;
				console.log('Texto desofuscado: ' + result);
			}
			i++;
		}
	},
};

console.log(hexaChar.decode(`%20and%20%27x%27%3D%27x|0|80020009|Either_BOF_or_EOF_is_True__or_the_current_record_has_been_deleted._Requested_operation_requires_a_current_record. 500 0 16 www.enterprise.com Mozilla/4.0+(compatible;+MSIE+7.0;+Windows+NT+5.1;+SV1;+.NET+CLR+2.0.50727)
2019-06-14 00:42:50 187.64.32.163 GET /principal/myService/inter/inicio.php ed=arqtbc%99/5030&negocio=BR%20and%28select%201%20from%28select%20count%28*%29%2Cconcat%28%28select%20%28select%20concat%280x7e%2C0x27%2Cunhex%28Hex%28cast%28database%28%29%20as%20char%29%29%29%2C0x27%2C0x7e%29%29%20from%20%60information_schema%60.tables%20limit%200%2C1%29%2Cfloor%28rand%280%29*2%29%29x%20from%20%60information_schema%60.tables%20group%20by%20x%29a%29%20and%201%3D1|0|80020009|Either_BOF_or_EOF_is_True__or_the_current_record_has_been_deleted._Requested_operation_requires_a_current_record. 500 0 16 www.enterprise.com Mozilla/4.0+(compatible;+MSIE+7.0;+Windows+NT+5.1;+SV1;+.NET+CLR+2.0.50727)AAAAAAAAAAAAAAAAAAAAAAAA=0x31303235343830303536^BBBBBBBBBBB=31`));

// module.export = hexaChar;