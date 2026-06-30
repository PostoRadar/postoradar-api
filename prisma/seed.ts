import { Combustivel, PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Id fictício de colaborador para os preços de exemplo. Em produção esse valor
// vem do token JWT (serviço de autenticação); aqui é apenas dado de demonstração.
const COLABORADOR_SEED = '11111111-1111-1111-1111-111111111111';

interface PrecoSeed {
  combustivel: Combustivel;
  valor: number;
}

interface PostoSeed {
  nome: string;
  bandeira: string;
  endereco: string;
  bairro: string;
  cidade: string;
  estado: string;
  cep?: string;
  latitude: number;
  longitude: number;
  precos: PrecoSeed[];
}

const postos: PostoSeed[] = [
  {
    nome: 'Posto Boa Viagem',
    bandeira: 'Ipiranga',
    endereco: 'Av. Conselheiro Aguiar, 2738',
    bairro: 'Boa Viagem',
    cidade: 'Recife',
    estado: 'PE',
    cep: '51020-021',
    latitude: -8.1227,
    longitude: -34.9015,
    precos: [
      { combustivel: Combustivel.GASOLINA_COMUM, valor: 5.89 },
      { combustivel: Combustivel.GASOLINA_ADITIVADA, valor: 5.99 },
      { combustivel: Combustivel.ETANOL, valor: 4.19 },
      { combustivel: Combustivel.DIESEL_S10, valor: 6.29 },
    ],
  },
  {
    nome: 'Auto Posto Pina',
    bandeira: 'Shell',
    endereco: 'Av. Herculano Bandeira, 513',
    bairro: 'Pina',
    cidade: 'Recife',
    estado: 'PE',
    cep: '51110-130',
    latitude: -8.0901,
    longitude: -34.8847,
    precos: [
      { combustivel: Combustivel.GASOLINA_COMUM, valor: 5.95 },
      { combustivel: Combustivel.ETANOL, valor: 4.29 },
      { combustivel: Combustivel.GNV, valor: 4.09 },
    ],
  },
  {
    nome: 'Posto Casa Forte',
    bandeira: 'Petrobras',
    endereco: 'Av. Dezessete de Agosto, 1020',
    bairro: 'Casa Forte',
    cidade: 'Recife',
    estado: 'PE',
    cep: '52061-540',
    latitude: -8.0309,
    longitude: -34.9123,
    precos: [
      { combustivel: Combustivel.GASOLINA_COMUM, valor: 5.79 },
      { combustivel: Combustivel.GASOLINA_ADITIVADA, valor: 5.89 },
      { combustivel: Combustivel.DIESEL, valor: 6.05 },
    ],
  },
  {
    nome: 'Posto Madalena',
    bandeira: 'Ale',
    endereco: 'Rua Real da Torre, 850',
    bairro: 'Madalena',
    cidade: 'Recife',
    estado: 'PE',
    cep: '50610-000',
    latitude: -8.0524,
    longitude: -34.9119,
    precos: [
      { combustivel: Combustivel.GASOLINA_COMUM, valor: 5.85 },
      { combustivel: Combustivel.ETANOL, valor: 4.09 },
    ],
  },
  {
    nome: 'Posto Espinheiro',
    bandeira: 'Ipiranga',
    endereco: 'Av. Rui Barbosa, 1245',
    bairro: 'Espinheiro',
    cidade: 'Recife',
    estado: 'PE',
    cep: '52020-110',
    latitude: -8.0407,
    longitude: -34.8975,
    precos: [
      { combustivel: Combustivel.GASOLINA_COMUM, valor: 5.92 },
      { combustivel: Combustivel.GASOLINA_ADITIVADA, valor: 6.05 },
      { combustivel: Combustivel.ETANOL, valor: 4.25 },
      { combustivel: Combustivel.DIESEL_S10, valor: 6.35 },
    ],
  },
  {
    nome: 'Posto Boa Vista',
    bandeira: 'Branca',
    endereco: 'Rua do Hospício, 320',
    bairro: 'Boa Vista',
    cidade: 'Recife',
    estado: 'PE',
    cep: '50050-050',
    latitude: -8.0578,
    longitude: -34.8869,
    precos: [
      { combustivel: Combustivel.GASOLINA_COMUM, valor: 5.69 },
      { combustivel: Combustivel.ETANOL, valor: 3.99 },
      { combustivel: Combustivel.GNV, valor: 3.95 },
    ],
  },
  {
    nome: 'Posto Imbiribeira',
    bandeira: 'Shell',
    endereco: 'Av. Mascarenhas de Morais, 2100',
    bairro: 'Imbiribeira',
    cidade: 'Recife',
    estado: 'PE',
    cep: '51150-000',
    latitude: -8.1124,
    longitude: -34.9176,
    precos: [
      { combustivel: Combustivel.GASOLINA_COMUM, valor: 5.99 },
      { combustivel: Combustivel.DIESEL, valor: 6.15 },
      { combustivel: Combustivel.DIESEL_S10, valor: 6.39 },
    ],
  },
  {
    nome: 'Posto Torre',
    bandeira: 'Petrobras',
    endereco: 'Rua Conde de Irajá, 480',
    bairro: 'Torre',
    cidade: 'Recife',
    estado: 'PE',
    cep: '50710-310',
    latitude: -8.0445,
    longitude: -34.9087,
    precos: [
      { combustivel: Combustivel.GASOLINA_COMUM, valor: 5.82 },
      { combustivel: Combustivel.GASOLINA_ADITIVADA, valor: 5.95 },
      { combustivel: Combustivel.ETANOL, valor: 4.15 },
    ],
  },
  {
    nome: 'Posto Várzea',
    bandeira: 'Ale',
    endereco: 'Av. Caxangá, 5200',
    bairro: 'Várzea',
    cidade: 'Recife',
    estado: 'PE',
    cep: '50741-000',
    latitude: -8.0512,
    longitude: -34.9518,
    precos: [
      { combustivel: Combustivel.GASOLINA_COMUM, valor: 5.75 },
      { combustivel: Combustivel.ETANOL, valor: 4.05 },
      { combustivel: Combustivel.DIESEL, valor: 5.98 },
      { combustivel: Combustivel.GNV, valor: 4.02 },
    ],
  },
  {
    nome: 'Posto Aflitos',
    bandeira: 'Ipiranga',
    endereco: 'Rua do Futuro, 150',
    bairro: 'Aflitos',
    cidade: 'Recife',
    estado: 'PE',
    cep: '52050-010',
    latitude: -8.0386,
    longitude: -34.9009,
    precos: [
      { combustivel: Combustivel.GASOLINA_COMUM, valor: 5.88 },
      { combustivel: Combustivel.GASOLINA_ADITIVADA, valor: 6.02 },
      { combustivel: Combustivel.DIESEL_S10, valor: 6.28 },
    ],
  },
];

async function main() {
  // Recomeça do zero para o seed ser idempotente. O delete em postos remove os
  // preços em cascata, mas limpamos ambos explicitamente por clareza.
  await prisma.preco.deleteMany();
  await prisma.posto.deleteMany();

  for (const { precos, ...posto } of postos) {
    await prisma.posto.create({
      data: {
        ...posto,
        precos: {
          create: precos.map((preco) => ({ ...preco, reportadoPor: COLABORADOR_SEED })),
        },
      },
    });
  }

  const totalPostos = await prisma.posto.count();
  const totalPrecos = await prisma.preco.count();
  console.log(`Seed concluído: ${totalPostos} postos e ${totalPrecos} preços inseridos.`);
}

main()
  .catch((err) => {
    console.error('Falha ao executar o seed:', err);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
