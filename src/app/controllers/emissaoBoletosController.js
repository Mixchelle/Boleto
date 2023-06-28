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

  // ...

$scope.buscarCliente = function() {
  const codigoCliente = $scope.cliente.codigoCliente;
  const clienteEncontrado = clientes.find(function(cliente) {
    return cliente.codigo === codigoCliente;
  });

  if (clienteEncontrado) {
    $scope.cliente = angular.copy(clienteEncontrado);
    $scope.clienteEncontrado = true;
  } else {
    reiniciarTela();
    $scope.clienteEncontrado = false;
  }
};

$scope.emitirBoleto = function() {
  const novoBoleto = {
    valor: $scope.cliente.valorParcela,
    vencimento: $scope.cliente.vencimentoPrimeiraParcela,
    status: 'pendente'
  };

  $scope.cliente.boletos.push(novoBoleto);

  $scope.cliente.valorTotal = calcularValorTotal();
  $scope.cliente.novoValor = $scope.cliente.valorTotal;

  salvarClientesAtivos(clientes);
  reiniciarTela();
};

$scope.aplicarDesconto = function() {
  const desconto = $scope.cliente.descontos;
  $scope.cliente.novoValor = $scope.cliente.valorTotal - desconto;
};

$scope.aplicarJuros = function() {
  const juros = $scope.cliente.juros;
  $scope.cliente.novoValor = $scope.cliente.valorTotal * (1 + juros / 100);
};

$scope.alterarDataEmissao = function() {
  const novaDataEmissao = $scope.cliente.novaDataEmissao;
  const boletos = $scope.cliente.boletos;

  for (let i = 0; i < boletos.length; i++) {
    boletos[i].emissao = novaDataEmissao;
  }

  salvarClientesAtivos(clientes);
};

const calcularValorTotal = function() {
  const boletos = $scope.cliente.boletos;
  let valorTotal = 0;

  for (let i = 0; i < boletos.length; i++) {
    valorTotal += boletos[i].valor;
  }

  return valorTotal;
};

reiniciarTela();
});
