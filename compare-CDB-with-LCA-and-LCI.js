/**
* CONSTANTES
*/
var TIPO_INVESTIMENTO = "CDB";
var CDI = "CDI";

var IR = [
	[1, 180, 22.5],
	[181, 360, 20],
	[361, 720, 17.5],
	[721, 99999, 15]
];


/**
* SCRIPT
*/

var cdbTable = $x('//*[@id="cphMinhaConta_wcCompra1_rptCategorias_gvAtivosCompra_1"]/tbody/tr');

if (cdbTable.length < 1) {
	throw new Error("Não foi encontrando a tabela para o calculo");
}

cdbTable.forEach(function(entry) {
	var element = $(entry);

	var investimentoTd = element.find('td').eq(1);
	var investimento = investimentoTd.text().trim();

	if (investimento.indexOf(TIPO_INVESTIMENTO) > -1) {
		var vencimento = element.find('td').eq(3).text().trim();
		var taxa = element.find('td').eq(4).text().trim();

		var comparatedValue = calcComparateToLCIandLCA(taxa, vencimento);

		var appendText = "<td></td>";

		if (!isNaN(comparatedValue)) {
			console.log(comparatedValue);

			var appendText = "<td> LCI/LCA (" + comparatedValue + ") </td>";
		}

		element.append(appendText);
	}

	
});


/**
* FUNCOES
*/

function taxaToNumber(text) {
	if (text.indexOf(CDI) > -1) {
		text = text.replace(',', '.');
		text = text.replace('%', '');
		text = text.replace(CDI, '');

		text = text.trim();
	}

	if (text == "") {
		text = "100";
	}

	return text;
}

function diffDateInDays(text) {
	var regexp = /([0-9]{1,2})\/([0-9]{1,2})\/([0-9]{4})/g;
	var match = regexp.exec(text);

	var today = new Date();
	var future = new Date(match[2] + "/" + match[1] + "/" + match[3]);

	var timeDiff = Math.abs(future.getTime() - today.getTime());
	return Math.ceil(timeDiff / (1000 * 3600 * 24)); 
}

function irFromVencimento(vencimento) {
	var ir = 0;
	var days = diffDateInDays(vencimento);

	IR.forEach(function(entry) {
		if (days >= entry[0] && days <= entry[1]) {
			ir = entry[2];
		}
	});

	return ir;
}

function calcComparateToLCIandLCA(rendimento, vencimento) {
	var percentual = parseFloat(rendimento); // 110
	var ir = irFromVencimento(vencimento); // 17.5

	ir = ir/100;

	value = percentual * (1 - ir);

	return Math.floor(value * 100) / 100;
}
