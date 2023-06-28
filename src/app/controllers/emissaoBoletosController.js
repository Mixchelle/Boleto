angular.module('meuApp', []).controller('emissaoBoletosController', function($scope) {
  const clientes = [
    {
      codigo: '001',
      nome: 'Naruto Uzumaki',
      empresa: 'Empresa ABC',
      cnpj: '12.345.678/0001-23',
      boletos: []
    },
    {
      codigo: '002',
      nome: 'Sasuke Uchiha',
      empresa: 'Empresa XYZ',
      cnpj: '98.765.432/0001-10',
      boletos: []
    },
    {
      codigo: '003',
      nome: 'Sakura Haruno',
      empresa: 'Empresa QRS',
      cnpj: '11.223.344/0001-55',
      boletos: []
    },
    {
      codigo: '004',
      nome: 'Kakashi Hatake',
      empresa: 'Empresa WXY',
      cnpj: '99.887.766/0001-32',
      boletos: []
    },
    {
      codigo: '005',
      nome: 'Hinata Hyuga',
      empresa: 'Empresa LMN',
      cnpj: '77.665.544/0001-99',
      boletos: []
    },
    {
      codigo: '006',
      nome: 'Shikamaru Nara',
      empresa: 'Empresa PQR',
      cnpj: '55.443.332/0001-66',
      boletos: []
    }
  ];

  $scope.cliente = {
    codigoCliente: '',
    nome: '',
    empresa: '',
    cnpj: '',
    valorTotal: 0,
    quantidadeParcelas: 1,
    valorParcela: 0,
    vencimentoPrimeiraParcela: '',
    juros: 0,
    descontos: 0,
    boletos: [],
    novoValor: 0,
    novaDataEmissao: '' // Nova propriedade para salvar a nova data de emissão
  };

  const reiniciarTela = function() {
    $scope.cliente = {
      codigoCliente: '',
      nome: '',
      empresa: '',
      cnpj: '',
      valorTotal: 0,
      quantidadeParcelas: 1,
      valorParcela: 0,
      vencimentoPrimeiraParcela: '',
      juros: 0,
      descontos: 0,
      boletos: [],
      novoValor: 0,
      novaDataEmissao: '' // Reinicia a propriedade novaDataEmissao
    };
    $scope.clienteEncontrado = false;
    $scope.clientesAtivos = obterClientesAtivos();
  };

  const obterClientesAtivos = function() {
    const boletos = localStorage.getItem('boletos');
    if (boletos) {
      return JSON.parse(boletos);
    } else {
      return [];
    }
  };

  const salvarClientesAtivos = function(clientes) {
    localStorage.setItem('boletos', JSON.stringify(clientes));
  };

  $scope.buscarCliente = function() {
    const codigoCliente = $scope.cliente.codigoCliente;
    const clienteEncontrado = clientes.find(function(cliente) {
      return cliente.codigo === codigoCliente;
    });

    if (clienteEncontrado) {
      $scope.cliente = angular.copy(clienteEncontrado);
      $scope.clienteEncontrado = true;
    } else {
      $scope.clienteEncontrado = false;
      $scope.cliente.nome = '';
      $scope.cliente.empresa = '';
      $scope.cliente.cnpj = '';
    }
  };

  $scope.emitirBoleto = function() {
    $scope.clienteConfirmado = true;
  };

  $scope.confirmarBoleto = function() {
    const boleto = {
      data1parcela: new Date().toISOString().substring(0, 10),
      nome: $scope.cliente.nome,
      empresa: $scope.cliente.empresa,
      cnpj: $scope.cliente.cnpj,
      valorTotal: $scope.cliente.valorTotal,
      parcelas: $scope.cliente.quantidadeParcelas,
      valorParcelas: ($scope.cliente.valorTotal / $scope.cliente.quantidadeParcelas).toFixed(2),
      parcelasDetalhes: []
    };

    // Gerar parcelas
    const primeiraParcela = new Date($scope.cliente.vencimentoPrimeiraParcela);
    for (let i = 0; i < $scope.cliente.quantidadeParcelas; i++) {
      const numeroBoleto = Math.floor(Math.random() * 1000000);
      const parcela = {
        numero: i + 1,
        numeroBoleto: numeroBoleto,
        dataVencimento: new Date(primeiraParcela.getFullYear(), primeiraParcela.getMonth() + i, primeiraParcela.getDate()),
        dataEmissao: new Date(),
        juros: 0,
        desconto: 0
      };
      boleto.parcelasDetalhes.push(parcela);
    }

    $scope.cliente.boletos.push(boleto);
    $scope.clientesAtivos.push(angular.copy($scope.cliente));
    salvarClientesAtivos($scope.clientesAtivos);
    alert('Boletos gerados com sucesso!');
    reiniciarTela();
  };

  $scope.clientesAtivos = obterClientesAtivos();
  $scope.mostrarClientesAtivos = $scope.clientesAtivos.length > 0;

  $scope.calcularValorTotal = function() {
    $scope.cliente.valorTotal = $scope.cliente.valorTotal + ($scope.cliente.valorTotal * ($scope.cliente.juros / 100));
    $scope.cliente.valorTotal = $scope.cliente.valorTotal - ($scope.cliente.valorTotal * ($scope.cliente.descontos / 100));
  };

  $scope.adicionarParcela = function() {
    const parcela = {
      numero: $scope.cliente.boletos[0].parcelasDetalhes.length + 1,
      dataEmissao: new Date(),
      juros: 0,
      desconto: 0
    };
    $scope.cliente.boletos[0].parcelasDetalhes.push(parcela);
    salvarClientesAtivos($scope.clientesAtivos);
  };

  $scope.gerarSegundaVia = function(parcela) {
    $scope.cliente.novaDataEmissao = parcela.novaDataEmissao; // Salva a nova data de emissão no estado do cliente
    const novaDataEmissao = new Date(parcela.novaDataEmissao);
    const dataOriginalVencimento = new Date(parcela.dataVencimento);
    const diffDias = Math.ceil((novaDataEmissao - dataOriginalVencimento) / (1000 * 60 * 60 * 24));
    let juros = 0;
    let desconto = 0;

    if (diffDias > 3) {
      juros = parcela.valorParcela * 0.02;
    } else if (novaDataEmissao > dataOriginalVencimento) {
      const diffDiasVencimento = Math.floor((novaDataEmissao - dataOriginalVencimento) / (1000 * 60 * 60 * 24));
      if (diffDiasVencimento >= 30) {
        desconto = parcela.valorParcela * 0.05;
      }
    }

    const novoValor = parcela.valorParcela + juros - desconto;
    alert(`Valor Atualizado: R$ ${novoValor.toFixed(2)}\nJuros: R$ ${juros.toFixed(2)}\nDesconto: R$ ${desconto.toFixed(2)}`);
  };

  // Inicialização
  reiniciarTela();
});