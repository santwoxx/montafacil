import { randomBytes } from "crypto";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

const ADMIN_EMAIL = "admin@montafacil.com";
// Gera uma senha aleatória a cada execução (nunca fixa/gravada no código),
// já que este script fica num repositório público.
const ADMIN_SENHA = randomBytes(9).toString("base64url");

// Senha de todos os usuários de demonstração abaixo (montadores fictícios) —
// fixa e documentada no README, só para facilitar a apresentação do
// sistema. Nenhum dado real de cliente/empresa aparece neste arquivo.
const DEMO_SENHA = "Demo@2026";

// --- Ajuda para datas relativas a "agora" -------------------------------
// Todas as datas de demonstração são relativas ao momento em que o seed
// roda (não fixas), então o painel sempre parece atual, mesmo meses depois
// do primeiro deploy.
function diasAtras(dias: number, hora = 9, minuto = 0) {
  const d = new Date();
  d.setDate(d.getDate() - dias);
  d.setHours(hora, minuto, 0, 0);
  return d;
}
function diasNaFrente(dias: number, hora = 9) {
  return diasAtras(-dias, hora);
}
function arredondar(valor: number) {
  return Math.round(valor * 100) / 100;
}

async function main() {
  // 1. Administrador -------------------------------------------------
  const existente = await prisma.user.findUnique({ where: { email: ADMIN_EMAIL } });

  if (existente) {
    console.log(`Usuário administrador já existe (${ADMIN_EMAIL}).`);
  } else {
    const senhaHash = await bcrypt.hash(ADMIN_SENHA, 10);

    await prisma.user.create({
      data: {
        nome: "Administrador",
        email: ADMIN_EMAIL,
        senha: senhaHash,
        role: "ADMIN",
      },
    });

    console.log("Usuário administrador criado com sucesso:");
    console.log(`  E-mail: ${ADMIN_EMAIL}`);
    console.log(`  Senha:  ${ADMIN_SENHA}`);
    console.log("Troque essa senha após o primeiro acesso.");
  }

  // 2. Dados de demonstração ------------------------------------------
  //
  // Tudo abaixo é fictício (nenhuma empresa, cliente ou montador real) e
  // existe só para o sistema não aparecer vazio numa demonstração. Os
  // registros usam IDs fixos com prefixo "demo-" e são recriados via
  // upsert a cada deploy, então: (a) rodar o seed várias vezes não duplica
  // nada, e (b) o painel se "autocura" mesmo que alguém edite/exclua algo
  // durante uma demonstração ao vivo.
  //
  // ANTES DE ENTREGAR PARA UM CLIENTE DE VERDADE: apague este bloco (ou o
  // arquivo inteiro, mantendo só a criação do administrador acima) e rode
  // as migrações num banco novo e vazio.
  console.log("\nCriando dados de demonstração...");

  const senhaDemoHash = await bcrypt.hash(DEMO_SENHA, 10);

  const montadoresDemo = [
    {
      id: "demo-montador-carlos",
      nome: "Carlos Eduardo Ferreira",
      email: "carlos.ferreira@demo.montafacil.app",
      telefone: "(41) 99811-2233",
      comissaoPadrao: 12,
      fotoUrl: null,
    },
    {
      id: "demo-montador-juliana",
      nome: "Juliana Alves Ribeiro",
      email: "juliana.ribeiro@demo.montafacil.app",
      telefone: "(41) 99722-4455",
      comissaoPadrao: 15,
      fotoUrl: null,
    },
    {
      id: "demo-montador-rafael",
      nome: "Rafael Souza Lima",
      email: "rafael.lima@demo.montafacil.app",
      telefone: "(41) 99633-6677",
      comissaoPadrao: 10,
      fotoUrl: null,
    },
    {
      id: "demo-montador-patricia",
      nome: "Patrícia Gomes Santos",
      email: "patricia.santos@demo.montafacil.app",
      telefone: "(41) 99544-8899",
      comissaoPadrao: 12,
      fotoUrl: null,
    },
    {
      id: "demo-montador-thiago",
      nome: "Thiago Martins Costa",
      email: "thiago.costa@demo.montafacil.app",
      telefone: "(41) 99455-1122",
      comissaoPadrao: 8,
      fotoUrl: null,
    },
  ] as const;

  for (const m of montadoresDemo) {
    await prisma.user.upsert({
      where: { id: m.id },
      update: {
        nome: m.nome,
        email: m.email,
        telefone: m.telefone,
        comissaoPadrao: m.comissaoPadrao,
        role: "MONTADOR",
        ativo: true,
        senha: senhaDemoHash,
      },
      create: {
        id: m.id,
        nome: m.nome,
        email: m.email,
        telefone: m.telefone,
        comissaoPadrao: m.comissaoPadrao,
        role: "MONTADOR",
        ativo: true,
        senha: senhaDemoHash,
      },
    });
  }
  console.log(`  ${montadoresDemo.length} montadores de demonstração (senha: ${DEMO_SENHA}).`);

  const lojasDemo = [
    {
      id: "demo-loja-bella-casa",
      nome: "Móveis Bella Casa",
      cnpj: "12345678000155",
      telefone: "(41) 3222-1010",
      endereco: "Av. das Araucárias, 1450, Centro, Curitiba - PR",
    },
    {
      id: "demo-loja-conforto-lar",
      nome: "Conforto Lar Móveis e Decorações",
      cnpj: "23456789000166",
      telefone: "(41) 3233-2020",
      endereco: "Rua XV de Novembro, 880, Batel, Curitiba - PR",
    },
    {
      id: "demo-loja-casa-estilo",
      nome: "Casa & Estilo Móveis Planejados",
      cnpj: "34567890000177",
      telefone: "(41) 3244-3030",
      endereco: "Av. Sete de Setembro, 3200, Água Verde, Curitiba - PR",
    },
    {
      id: "demo-loja-mobilia-prime",
      nome: "Mobília Prime",
      cnpj: "45678901000188",
      telefone: "(41) 3255-4040",
      endereco: "Rua Marechal Deodoro, 610, Centro, Curitiba - PR",
    },
    {
      id: "demo-loja-decorar",
      nome: "Decorar Móveis & Design",
      cnpj: "56789012000199",
      telefone: "(41) 3266-5050",
      endereco: "Av. Iguaçu, 2100, Rebouças, Curitiba - PR",
    },
    {
      id: "demo-loja-aconchego",
      nome: "Espaço Aconchego Móveis",
      cnpj: "67890123000100",
      telefone: "(41) 3277-6060",
      endereco: "Rua Comendador Araújo, 733, Centro, Curitiba - PR",
    },
  ] as const;

  for (const l of lojasDemo) {
    await prisma.loja.upsert({
      where: { id: l.id },
      update: {
        nome: l.nome,
        cnpj: l.cnpj,
        telefone: l.telefone,
        endereco: l.endereco,
        ativo: true,
      },
      create: {
        id: l.id,
        nome: l.nome,
        cnpj: l.cnpj,
        telefone: l.telefone,
        endereco: l.endereco,
        ativo: true,
      },
    });
  }
  console.log(`  ${lojasDemo.length} lojas parceiras de demonstração.`);

  // Comissões específicas por loja (as combinações não listadas caem no
  // comissaoPadrao de cada montador) — mostra a tela de "comissão por loja"
  // já preenchida com alguma variação.
  const comissoesDemo = [
    { montadorId: "demo-montador-carlos", lojaId: "demo-loja-bella-casa", percentual: 18 },
    { montadorId: "demo-montador-carlos", lojaId: "demo-loja-mobilia-prime", percentual: 14 },
    { montadorId: "demo-montador-juliana", lojaId: "demo-loja-conforto-lar", percentual: 20 },
    { montadorId: "demo-montador-juliana", lojaId: "demo-loja-bella-casa", percentual: 16 },
    { montadorId: "demo-montador-rafael", lojaId: "demo-loja-casa-estilo", percentual: 12 },
    { montadorId: "demo-montador-patricia", lojaId: "demo-loja-decorar", percentual: 15 },
    { montadorId: "demo-montador-thiago", lojaId: "demo-loja-aconchego", percentual: 10 },
  ];

  for (const c of comissoesDemo) {
    await prisma.comissaoLoja.upsert({
      where: { montadorId_lojaId: { montadorId: c.montadorId, lojaId: c.lojaId } },
      update: { percentual: c.percentual },
      create: c,
    });
  }

  // Montagens de demonstração ------------------------------------------
  //
  // Mistura de status, datas e situações de pagamento para os painéis
  // (financeiro, "próximas montagens", dashboards de cada montador) terem o
  // que mostrar logo de cara. `dias` negativo = agendado no futuro.
  type MontagemDemo = {
    id: string;
    lojaId: string;
    montadorId: string | null;
    feitoPorAdm?: boolean;
    clienteNome: string;
    clienteTelefone: string;
    clienteEndereco: string;
    descricaoServico: string;
    valorServico: number;
    valorAssistencia?: number;
    percentualMontador: number;
    status: "PENDENTE" | "EM_ANDAMENTO" | "CONCLUIDO" | "CANCELADO";
    dias: number; // dias atrás da criação/agendamento
    pagoPelaLoja: boolean;
    pagoAoMontador: boolean;
    numeroPedido?: string;
  };

  const montagensDemo: MontagemDemo[] = [
    // -- Pendentes (algumas ainda sem montador definido) ------------------
    { id: "demo-montagem-001", lojaId: "demo-loja-bella-casa", montadorId: "demo-montador-juliana", clienteNome: "Ana Paula Rocha", clienteTelefone: "(41) 99111-2201", clienteEndereco: "Rua Padre Anchieta, 990, Bigorrilho, Curitiba - PR", descricaoServico: "Montagem: Guarda-roupa casal 6 portas + criado-mudo", valorServico: 780, percentualMontador: 16, status: "PENDENTE", dias: -3, pagoPelaLoja: false, pagoAoMontador: false, numeroPedido: "8801" },
    { id: "demo-montagem-002", lojaId: "demo-loja-conforto-lar", montadorId: null, clienteNome: "Bruno Henrique Dias", clienteTelefone: "(41) 99222-3302", clienteEndereco: "Rua Brasílio Itiberê, 240, Água Verde, Curitiba - PR", descricaoServico: "Montagem: Cozinha planejada completa (10 módulos)", valorServico: 1650, percentualMontador: 0, status: "PENDENTE", dias: -6, pagoPelaLoja: false, pagoAoMontador: false, numeroPedido: "8802" },
    { id: "demo-montagem-003", lojaId: "demo-loja-mobilia-prime", montadorId: "demo-montador-rafael", clienteNome: "Camila Fernandes", clienteTelefone: "(41) 99333-4403", clienteEndereco: "Rua Chile, 512, Rebouças, Curitiba - PR", descricaoServico: "Montagem: Cama box queen + cabeceira estofada", valorServico: 420, percentualMontador: 10, status: "PENDENTE", dias: -1, pagoPelaLoja: false, pagoAoMontador: false, numeroPedido: "8803" },
    { id: "demo-montagem-004", lojaId: "demo-loja-aconchego", montadorId: null, clienteNome: "Diego Rodrigues", clienteTelefone: "(41) 99444-5504", clienteEndereco: "Av. Manoel Ribas, 4310, Boa Vista, Curitiba - PR", descricaoServico: "Montagem: Estante de livros + escrivaninha home office", valorServico: 540, percentualMontador: 0, status: "PENDENTE", dias: -8, pagoPelaLoja: false, pagoAoMontador: false, numeroPedido: "8804" },

    // -- Em andamento ------------------------------------------------------
    { id: "demo-montagem-005", lojaId: "demo-loja-casa-estilo", montadorId: "demo-montador-thiago", clienteNome: "Elaine Cristina Souza", clienteTelefone: "(41) 99555-6605", clienteEndereco: "Rua Coronel Dulcídio, 155, Batel, Curitiba - PR", descricaoServico: "Montagem: Painel de TV + rack + home theater", valorServico: 390, percentualMontador: 10, status: "EM_ANDAMENTO", dias: 0, pagoPelaLoja: false, pagoAoMontador: false, numeroPedido: "8805" },
    { id: "demo-montagem-006", lojaId: "demo-loja-decorar", montadorId: "demo-montador-patricia", clienteNome: "Fábio Nogueira", clienteTelefone: "(41) 99666-7706", clienteEndereco: "Rua Emiliano Perneta, 720, Centro, Curitiba - PR", descricaoServico: "Montagem: Closet planejado 3 módulos", valorServico: 980, percentualMontador: 15, status: "EM_ANDAMENTO", dias: 1, pagoPelaLoja: false, pagoAoMontador: false, numeroPedido: "8806" },
    { id: "demo-montagem-007", lojaId: "demo-loja-bella-casa", montadorId: "demo-montador-carlos", clienteNome: "Gabriela Martins", clienteTelefone: "(41) 99777-8807", clienteEndereco: "Rua Mateus Leme, 2030, São Francisco, Curitiba - PR", descricaoServico: "Montagem: Guarda-roupa 4 portas + sapateira", valorServico: 610, percentualMontador: 18, status: "EM_ANDAMENTO", dias: 2, pagoPelaLoja: false, pagoAoMontador: false, numeroPedido: "8807" },

    // -- Concluídas neste mês ----------------------------------------------
    { id: "demo-montagem-008", lojaId: "demo-loja-bella-casa", montadorId: "demo-montador-carlos", clienteNome: "Henrique Barbosa", clienteTelefone: "(41) 99888-9908", clienteEndereco: "Av. Cândido Hartmann, 501, Bigorrilho, Curitiba - PR", descricaoServico: "Montagem: Guarda-roupa casal 8 portas de correr", valorServico: 1120, percentualMontador: 18, status: "CONCLUIDO", dias: 2, pagoPelaLoja: true, pagoAoMontador: true, numeroPedido: "8790" },
    { id: "demo-montagem-009", lojaId: "demo-loja-conforto-lar", montadorId: "demo-montador-juliana", clienteNome: "Isabela Correia", clienteTelefone: "(41) 99999-0009", clienteEndereco: "Rua Desembargador Motta, 1780, Mercês, Curitiba - PR", descricaoServico: "Montagem: Sala de jantar completa (mesa 6 lugares + buffet)", valorServico: 890, valorAssistencia: 12, percentualMontador: 20, status: "CONCLUIDO", dias: 3, pagoPelaLoja: true, pagoAoMontador: false, numeroPedido: "8791" },
    { id: "demo-montagem-010", lojaId: "demo-loja-mobilia-prime", montadorId: "demo-montador-rafael", clienteNome: "João Vitor Almeida", clienteTelefone: "(41) 98111-1110", clienteEndereco: "Rua Konrad Adenauer, 90, Tarumã, Curitiba - PR", descricaoServico: "Montagem: Escrivaninha gamer + cadeira + estante", valorServico: 340, percentualMontador: 10, status: "CONCLUIDO", dias: 4, pagoPelaLoja: true, pagoAoMontador: true, numeroPedido: "8792" },
    { id: "demo-montagem-011", lojaId: "demo-loja-decorar", montadorId: "demo-montador-patricia", clienteNome: "Karina Duarte", clienteTelefone: "(41) 98222-2211", clienteEndereco: "Rua Fernando Simas, 340, Bigorrilho, Curitiba - PR", descricaoServico: "Montagem: Cozinha planejada compacta (6 módulos)", valorServico: 990, percentualMontador: 15, status: "CONCLUIDO", dias: 5, pagoPelaLoja: false, pagoAoMontador: false, numeroPedido: "8793" },
    { id: "demo-montagem-012", lojaId: "demo-loja-casa-estilo", montadorId: "demo-montador-thiago", clienteNome: "Leonardo Pires", clienteTelefone: "(41) 98333-3312", clienteEndereco: "Av. Silva Jardim, 1560, Água Verde, Curitiba - PR", descricaoServico: "Montagem: Bicama + colchões", valorServico: 260, percentualMontador: 10, status: "CONCLUIDO", dias: 6, pagoPelaLoja: true, pagoAoMontador: true, numeroPedido: "8794" },
    { id: "demo-montagem-013", lojaId: "demo-loja-aconchego", montadorId: "demo-montador-thiago", clienteNome: "Mariana Teixeira", clienteTelefone: "(41) 98444-4413", clienteEndereco: "Rua Nunes Machado, 620, Centro, Curitiba - PR", descricaoServico: "Montagem: Painel + rack suspenso + nichos", valorServico: 300, percentualMontador: 10, status: "CONCLUIDO", dias: 8, pagoPelaLoja: true, pagoAoMontador: false, numeroPedido: "8795" },
    { id: "demo-montagem-014", lojaId: "demo-loja-bella-casa", montadorId: null, feitoPorAdm: true, clienteNome: "Nicolas Andrade", clienteTelefone: "(41) 98555-5514", clienteEndereco: "Rua Presidente Faria, 480, Centro, Curitiba - PR", descricaoServico: "Montagem: Guarda-roupa infantil 3 portas", valorServico: 310, percentualMontador: 0, status: "CONCLUIDO", dias: 9, pagoPelaLoja: true, pagoAoMontador: true, numeroPedido: "8796" },
    { id: "demo-montagem-015", lojaId: "demo-loja-conforto-lar", montadorId: "demo-montador-juliana", clienteNome: "Otávio Ramos", clienteTelefone: "(41) 98666-6615", clienteEndereco: "Rua Marechal Floriano Peixoto, 2200, Cabral, Curitiba - PR", descricaoServico: "Montagem: Guarda-roupa 6 portas + cômoda", valorServico: 720, percentualMontador: 20, status: "CONCLUIDO", dias: 11, pagoPelaLoja: true, pagoAoMontador: true, numeroPedido: "8797" },

    // -- Concluídas no mês passado (histórico p/ financeiro) ---------------
    { id: "demo-montagem-016", lojaId: "demo-loja-mobilia-prime", montadorId: "demo-montador-carlos", clienteNome: "Paula Cavalcanti", clienteTelefone: "(41) 98777-7716", clienteEndereco: "Rua Doutor Faivre, 405, Centro, Curitiba - PR", descricaoServico: "Montagem: Painel de TV 65\" + rack baixo", valorServico: 260, percentualMontador: 14, status: "CONCLUIDO", dias: 34, pagoPelaLoja: true, pagoAoMontador: true, numeroPedido: "8760" },
    { id: "demo-montagem-017", lojaId: "demo-loja-decorar", montadorId: "demo-montador-patricia", clienteNome: "Quésia Monteiro", clienteTelefone: "(41) 98888-8817", clienteEndereco: "Rua Buenos Aires, 610, Rebouças, Curitiba - PR", descricaoServico: "Montagem: Guarda-roupa casal 6 portas de correr com espelho", valorServico: 1050, valorAssistencia: 15, percentualMontador: 15, status: "CONCLUIDO", dias: 38, pagoPelaLoja: true, pagoAoMontador: true, numeroPedido: "8761" },
    { id: "demo-montagem-018", lojaId: "demo-loja-casa-estilo", montadorId: "demo-montador-rafael", clienteNome: "Ricardo Bezerra", clienteTelefone: "(41) 98999-9918", clienteEndereco: "Av. Vicente Machado, 2900, Batel, Curitiba - PR", descricaoServico: "Montagem: Escritório completo (mesa em L + estante + gaveteiro)", valorServico: 640, percentualMontador: 12, status: "CONCLUIDO", dias: 42, pagoPelaLoja: true, pagoAoMontador: true, numeroPedido: "8762" },
    { id: "demo-montagem-019", lojaId: "demo-loja-bella-casa", montadorId: "demo-montador-juliana", clienteNome: "Sabrina Lopes", clienteTelefone: "(41) 97111-1119", clienteEndereco: "Rua Lamenha Lins, 1330, Rebouças, Curitiba - PR", descricaoServico: "Montagem: Cozinha planejada em L (8 módulos)", valorServico: 1380, percentualMontador: 16, status: "CONCLUIDO", dias: 50, pagoPelaLoja: true, pagoAoMontador: true, numeroPedido: "8730" },
    { id: "demo-montagem-020", lojaId: "demo-loja-aconchego", montadorId: "demo-montador-thiago", clienteNome: "Tiago Vasconcelos", clienteTelefone: "(41) 97222-2220", clienteEndereco: "Rua Barão do Rio Branco, 88, Centro, Curitiba - PR", descricaoServico: "Montagem: Bancada com prateleiras + armário aéreo", valorServico: 410, percentualMontador: 10, status: "CONCLUIDO", dias: 55, pagoPelaLoja: true, pagoAoMontador: true, numeroPedido: "8731" },
    { id: "demo-montagem-021", lojaId: "demo-loja-conforto-lar", montadorId: "demo-montador-carlos", clienteNome: "Vinícius Aragão", clienteTelefone: "(41) 97333-3321", clienteEndereco: "Rua João Negrão, 1120, Centro, Curitiba - PR", descricaoServico: "Montagem: Cômoda + berço + guarda-roupa infantil", valorServico: 560, percentualMontador: 18, status: "CONCLUIDO", dias: 63, pagoPelaLoja: true, pagoAoMontador: true, numeroPedido: "8732" },

    // -- Canceladas ----------------------------------------------------------
    { id: "demo-montagem-022", lojaId: "demo-loja-mobilia-prime", montadorId: "demo-montador-rafael", clienteNome: "Wesley Cardoso", clienteTelefone: "(41) 97444-4422", clienteEndereco: "Rua Almirante Tamandaré, 780, São Francisco, Curitiba - PR", descricaoServico: "Montagem: Rack de TV suspenso", valorServico: 180, percentualMontador: 10, status: "CANCELADO", dias: 15, pagoPelaLoja: false, pagoAoMontador: false, numeroPedido: "8798" },
    { id: "demo-montagem-023", lojaId: "demo-loja-decorar", montadorId: null, clienteNome: "Yasmin Ferreira", clienteTelefone: "(41) 97555-5523", clienteEndereco: "Rua Padre Anchieta, 2500, Bigorrilho, Curitiba - PR", descricaoServico: "Montagem: Cadeiras de jantar (kit com 6)", valorServico: 210, percentualMontador: 0, status: "CANCELADO", dias: 20, pagoPelaLoja: false, pagoAoMontador: false, numeroPedido: "8799" },
    { id: "demo-montagem-024", lojaId: "demo-loja-casa-estilo", montadorId: "demo-montador-patricia", clienteNome: "Zeca Oliveira", clienteTelefone: "(41) 97666-6624", clienteEndereco: "Av. Água Verde, 1900, Água Verde, Curitiba - PR", descricaoServico: "Montagem: Mesa de centro + aparador", valorServico: 150, percentualMontador: 15, status: "CANCELADO", dias: 26, pagoPelaLoja: false, pagoAoMontador: false, numeroPedido: "8800" },
  ];

  for (const m of montagensDemo) {
    const valorMontador = arredondar((m.valorServico * m.percentualMontador) / 100);
    const criadoEm = diasAtras(Math.max(m.dias, 0) + (m.status === "CONCLUIDO" ? 2 : 0));
    const dataAgendada = diasAtras(m.dias);
    const concluidoEm = m.status === "CONCLUIDO" ? diasAtras(m.dias) : null;

    const dados = {
      lojaId: m.lojaId,
      montadorId: m.montadorId,
      feitoPorAdm: m.feitoPorAdm ?? false,
      clienteNome: m.clienteNome,
      clienteTelefone: m.clienteTelefone,
      clienteEndereco: m.clienteEndereco,
      numeroPedido: m.numeroPedido ?? null,
      descricaoServico: m.descricaoServico,
      valorServico: m.valorServico,
      valorAssistencia: m.valorAssistencia ?? 0,
      percentualMontador: m.percentualMontador,
      valorMontador,
      status: m.status,
      dataAgendada,
      concluidoEm,
      pagoPelaLoja: m.pagoPelaLoja,
      pagoAoMontador: m.pagoAoMontador,
    };

    await prisma.montagem.upsert({
      where: { id: m.id },
      update: dados,
      create: { id: m.id, createdAt: criadoEm, ...dados },
    });
  }
  console.log(`  ${montagensDemo.length} montagens de demonstração.`);

  // Notas pendentes de demonstração ---------------------------------------
  // Mostram a fila de "pedidos aguardando revisão" (ver /admin/montagens/nova).
  // A terceira sugere uma loja que ainda não existe no sistema, para
  // demonstrar o cadastro automático ao clicar em "Usar esta nota".
  const notasPendentesDemo = [
    {
      id: "demo-nota-001",
      clienteNome: "Renata Silva Andrade",
      clienteTelefone: "(41) 96111-2201",
      clienteEndereco: "Rua Padre Anchieta, 990, Bigorrilho, Curitiba - PR",
      descricaoServico: "Montagem: Guarda-roupa 3 portas de correr com espelho",
      valorServico: 620,
      dataAgendada: diasNaFrente(4),
      observacoes: "Cliente pediu para montar após as 14h.",
      lojaNomeSugerida: "Móveis Bella Casa",
      lojaCnpjSugerido: "12345678000155",
      montadorSugeridoId: "demo-montador-juliana",
      numeroPedido: "8901",
    },
    {
      id: "demo-nota-002",
      clienteNome: "Eduardo Martins Farias",
      clienteTelefone: "(41) 96222-3302",
      clienteEndereco: "Rua Marechal Deodoro, 700, Centro, Curitiba - PR",
      descricaoServico: "Montagem: Escrivaninha + cadeira + estante de nichos",
      valorServico: 380,
      dataAgendada: diasNaFrente(6),
      observacoes: null,
      lojaNomeSugerida: "Mobília Prime",
      lojaCnpjSugerido: "45678901000188",
      montadorSugeridoId: null,
      numeroPedido: "8902",
    },
    {
      id: "demo-nota-003",
      clienteNome: "Camila Torres Nunes",
      clienteTelefone: "(41) 96333-4403",
      clienteEndereco: "Av. das Torres, 450, Portão, Curitiba - PR",
      descricaoServico: "Montagem: Sala completa (sofá + mesa de centro + painel)",
      valorServico: 990,
      dataAgendada: diasNaFrente(9),
      observacoes: "Loja nova — ainda não cadastrada no sistema (demonstra o cadastro automático).",
      lojaNomeSugerida: "Nova Casa Ambientes",
      lojaCnpjSugerido: null,
      montadorSugeridoId: null,
      numeroPedido: "8903",
    },
  ];

  for (const n of notasPendentesDemo) {
    const { id, ...dados } = n;
    await prisma.notaPendente.upsert({
      where: { id },
      update: dados,
      create: { id, ...dados },
    });
  }
  console.log(`  ${notasPendentesDemo.length} notas pendentes de demonstração.`);

  // Avaliações de demonstração ---------------------------------------------
  // Ligadas às montagens concluídas acima — mistura de notas para parecer
  // autêntico (nem tudo é 5 estrelas).
  const avaliacoesDemo = [
    { montagemId: "demo-montagem-008", montadorId: "demo-montador-carlos", estrelas: 5, comentario: "Montador super pontual e caprichoso. Recomendo!" },
    { montagemId: "demo-montagem-009", montadorId: "demo-montador-juliana", estrelas: 5, comentario: "Trabalho rápido e organizado, deixou tudo limpinho." },
    { montagemId: "demo-montagem-010", montadorId: "demo-montador-rafael", estrelas: 4, comentario: "Bom atendimento, só atrasou um pouco pro horário combinado." },
    { montagemId: "demo-montagem-011", montadorId: "demo-montador-patricia", estrelas: 5, comentario: "Excelente! Explicou tudo e ainda deu dicas de organização." },
    { montagemId: "demo-montagem-012", montadorId: "demo-montador-thiago", estrelas: 5, comentario: null },
    { montagemId: "demo-montagem-013", montadorId: "demo-montador-thiago", estrelas: 3, comentario: "Ficou bom, mas notei alguns riscos no acabamento." },
    { montagemId: "demo-montagem-015", montadorId: "demo-montador-juliana", estrelas: 5, comentario: "Perfeito, super recomendo o trabalho dela!" },
    { montagemId: "demo-montagem-016", montadorId: "demo-montador-carlos", estrelas: 4, comentario: null },
    { montagemId: "demo-montagem-017", montadorId: "demo-montador-patricia", estrelas: 5, comentario: "Muito profissional, entregou antes do previsto." },
    { montagemId: "demo-montagem-018", montadorId: "demo-montador-rafael", estrelas: 4, comentario: "Bom serviço, recomendo." },
    { montagemId: "demo-montagem-019", montadorId: "demo-montador-juliana", estrelas: 5, comentario: "A cozinha ficou impecável, super satisfeita!" },
    { montagemId: "demo-montagem-020", montadorId: "demo-montador-thiago", estrelas: 5, comentario: null },
    { montagemId: "demo-montagem-021", montadorId: "demo-montador-carlos", estrelas: 5, comentario: "Cuidadoso com os móveis do quarto do bebê, adorei." },
  ];

  for (const a of avaliacoesDemo) {
    await prisma.avaliacao.upsert({
      where: { montagemId: a.montagemId },
      update: { estrelas: a.estrelas, comentario: a.comentario },
      create: a,
    });
  }
  console.log(`  ${avaliacoesDemo.length} avaliações de demonstração.`);

  // Ocorrências de demonstração ---------------------------------------------
  // Mostra o histórico de visitas com problema (cliente ausente, peça
  // danificada etc.) numa das montagens ainda pendentes/em andamento.
  const ocorrenciasDemo = [
    {
      id: "demo-ocorrencia-001",
      montagemId: "demo-montagem-001",
      tipo: "CLIENTE_AUSENTE" as const,
      observacao: "Ninguém atendeu no endereço. Cliente remarcou por WhatsApp para esta semana.",
      criadoEm: diasAtras(4),
    },
    {
      id: "demo-ocorrencia-002",
      montagemId: "demo-montagem-006",
      tipo: "PECA_DANIFICADA" as const,
      observacao: "Uma lateral do módulo veio riscada de fábrica — loja já foi avisada para trocar a peça.",
      criadoEm: diasAtras(1),
    },
  ];

  for (const o of ocorrenciasDemo) {
    await prisma.ocorrencia.upsert({
      where: { id: o.id },
      update: { tipo: o.tipo, observacao: o.observacao },
      create: o,
    });
  }
  console.log(`  ${ocorrenciasDemo.length} ocorrências de demonstração.`);

  console.log("\nDados de demonstração prontos.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
