const HtmlEntitiesPercent = {
	regex: /(%..)/g,
	decode: function (string) {
        var matches = [];
        while (match = this.regex.exec(string)) {
            matches.push(match);   
		}
		var i = 0;
		// console.log(`STRING TO DECODE: \n ${string}`);
		console.log('===========================');
		while(i < matches.length) {
			try{
				var newValue = decodeURIComponent(matches[i][1]);
			} catch (error){
				console.log(`ERRO -> VALUE MATCH(${matches[i][1]}) NEW VALUE(${newValue})`)
			}
			console.log(`VALUE MATCH(${matches[i][1]}) NEW VALUE(${newValue})`);
			string = string.replace(matches[i][0], newValue);
			i++;
		}
		console.log('===========================\n');
		return string;
	},
};
var string = 
`2019-06-14 00:42:15 187.64.32.163 GET /principal/myService/inter/inicio.php ed=arqtbc%99/5030&negocio=BR%20and%201%3E1|0|80020009|Either_BOF_or_EOF_is_True__or_the_current_record_has_been_deleted._Requested_operation_requires_a_current_record. 500 0 0 www.enterprise.com Mozilla/4.0+(compatible;+MSIE+7.0;+Windows+NT+5.1;+SV1;+.NET+CLR+2.0.50727)
2019-06-14 00:42:17 187.64.32.163 GET /principal/myService/inter/inicio.php ed=arqtbc%99/5030&negocio=BR%27%20and%20%27x%27%3D%27x|0|80020009|Either_BOF_or_EOF_is_True__or_the_current_record_has_been_deleted._Requested_operation_requires_a_current_record. 500 0 16 www.enterprise.com Mozilla/4.0+(compatible;+MSIE+7.0;+Windows+NT+5.1;+SV1;+.NET+CLR+2.0.50727)`

console.log(HtmlEntitiesPercent.decode(string));