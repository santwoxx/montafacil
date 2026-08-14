import { Role, StatusMontagem, TipoOcorrencia, User, Loja, ComissaoLoja, Montagem, NotaPendente, Ocorrencia, Avaliacao } from "./types";

export const usersData: User[] = [
  {
    id: "admin-1",
    nome: "Administrador",
    email: "admin@demo.com",
    telefone: "11999999999",
    fotoUrl: null,
    senha: "hash",
    role: "ADMIN",
    ativo: true,
    comissaoPadrao: 0,
    createdAt: new Date(),
  },
  {
    id: "montador-1",
    nome: "João Montador",
    email: "joao@demo.com",
    telefone: "11988888888",
    fotoUrl: null,
    senha: "hash",
    role: "MONTADOR",
    ativo: true,
    comissaoPadrao: 10,
    createdAt: new Date(),
  },
  {
    id: "montador-2",
    nome: "Maria Montadora",
    email: "maria@demo.com",
    telefone: "11977777777",
    fotoUrl: null,
    senha: "hash",
    role: "MONTADOR",
    ativo: true,
    comissaoPadrao: 12,
    createdAt: new Date(),
  }
];

export const lojasData: Loja[] = [
  {
    id: "loja-1",
    nome: "Loja de Móveis Centro",
    telefone: "1133333333",
    endereco: "Rua do Centro, 123",
    cnpj: "12345678000199",
    ativo: true,
    createdAt: new Date(),
  },
  {
    id: "loja-2",
    nome: "Magazine Moveleiro",
    telefone: "1144444444",
    endereco: "Av Brasil, 1000",
    cnpj: "98765432000188",
    ativo: true,
    createdAt: new Date(),
  }
];

export const comissoesData: ComissaoLoja[] = [
  {
    id: "com-1",
    montadorId: "montador-1",
    lojaId: "loja-1",
    percentual: 10,
  },
  {
    id: "com-2",
    montadorId: "montador-1",
    lojaId: "loja-2",
    percentual: 15,
  }
];

export const montagensData: Montagem[] = [
  {
    id: "mont-1",
    numeroPedido: "PED-1001",
    lojaId: "loja-1",
    montadorId: "montador-1",
    clienteNome: "Carlos Silva",
    clienteTelefone: "11966666666",
    clienteEndereco: "Rua das Flores, 45",
    descricaoServico: "Montagem de Guarda-roupa 6 portas",
    valorServico: 150.0,
    percentualMontador: 10,
    valorMontador: 15.0,
    valorAssistencia: 0,
    feitoPorAdm: false,
    dataAgendada: new Date(Date.now() + 86400000), // tomorrow
    status: "PENDENTE",
    pagoPelaLoja: false,
    pagoAoMontador: false,
    observacoes: null,
    createdAt: new Date(),
    updatedAt: new Date(),
    concluidoEm: null,
    fotoProdutoUrl: null,
    assinaturaMontador: null,
    assinaturaCliente: null,
    manualUrl: null,
    manualNomeArquivo: null,
    manualTipo: null,
    notificadoCentralSyncEm: null,
    avaliacaoSolicitadaEm: null,
    loja: lojasData[0],
    montador: usersData[1],
    avaliacao: null,
    ocorrencias: [],
  },
  {
    id: "mont-2",
    numeroPedido: "PED-1002",
    lojaId: "loja-2",
    montadorId: "montador-1",
    clienteNome: "Ana Souza",
    clienteTelefone: "11955555555",
    clienteEndereco: "Av Paulista, 200",
    descricaoServico: "Montagem de Mesa de Jantar",
    valorServico: 80.0,
    percentualMontador: 15,
    valorMontador: 12.0,
    valorAssistencia: 0,
    feitoPorAdm: false,
    dataAgendada: new Date(Date.now() - 86400000), // yesterday
    status: "CONCLUIDO",
    pagoPelaLoja: true,
    pagoAoMontador: false,
    observacoes: "Tudo certo",
    createdAt: new Date(Date.now() - 172800000),
    updatedAt: new Date(),
    concluidoEm: new Date(),
    fotoProdutoUrl: null,
    assinaturaMontador: null,
    assinaturaCliente: null,
    manualUrl: null,
    manualNomeArquivo: null,
    manualTipo: null,
    notificadoCentralSyncEm: null,
    avaliacaoSolicitadaEm: null,
    loja: lojasData[1],
    montador: usersData[1],
    avaliacao: null,
    ocorrencias: [],
  }
];

export const notasData: NotaPendente[] = [];
export const ocorrenciasData: Ocorrencia[] = [];
export const avaliacoesData: Avaliacao[] = [];
