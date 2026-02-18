// Dados genealógicos Janér-Melegari
// Estrutura simplificada para visualização

export interface Person {
  id: string;
  name: string;
  birthDate?: string;
  birthPlace?: string;
  deathDate?: string;
  deathPlace?: string;
  gender: 'M' | 'F';
  parents?: string[]; // IDs dos pais
  spouses?: string[]; // IDs dos cônjuges
  children?: string[]; // IDs dos filhos
  notes?: string;
}

export const familyData: Person[] = [
  // GERAÇÃO ATUAL
  {
    id: 'lars',
    name: 'Lars Tor Janér',
    birthDate: '10/05/1973',
    birthPlace: 'Rio de Janeiro, Brasil',
    gender: 'M',
    parents: ['tor', 'edina'],
    spouses: ['andrea'],
    children: ['laura', 'antonio', 'henrique'],
  },
  {
    id: 'andrea',
    name: 'Maria Andrea de Castro Melegari Janér',
    birthDate: '20/02/1973',
    birthPlace: 'Curitiba, Brasil',
    gender: 'F',
    parents: ['antonio-melegari', 'maria-alice'],
    spouses: ['lars'],
    children: ['laura', 'antonio', 'henrique'],
  },
  
  // FILHOS
  {
    id: 'laura',
    name: 'Laura Melegari Janér',
    birthDate: '18/06/2001',
    birthPlace: 'Rio de Janeiro',
    gender: 'F',
    parents: ['lars', 'andrea'],
    notes: 'Duke University, mora em NY',
  },
  {
    id: 'antonio',
    name: 'Antonio Melegari Janér',
    birthDate: '10/06/2003',
    birthPlace: 'São Paulo',
    gender: 'M',
    parents: ['lars', 'andrea'],
    notes: 'IE Business School, Madrid',
  },
  {
    id: 'henrique',
    name: 'Henrique Melegari Janér',
    birthDate: '01/11/2006',
    birthPlace: 'São Paulo',
    gender: 'M',
    parents: ['lars', 'andrea'],
    notes: 'IE Business School, Segovia',
  },

  // PAIS LARS
  {
    id: 'tor',
    name: 'Tor Lars Janér',
    birthDate: '07/10/1946',
    birthPlace: 'Rio de Janeiro',
    gender: 'M',
    parents: ['lars-wilhelm', 'teresa'],
    spouses: ['edina'],
    children: ['lars', 'claudia', 'celina'],
  },
  {
    id: 'edina',
    name: 'Edina Gabizo de Faria Janér',
    birthDate: '10/05/1945',
    birthPlace: 'Rio de Janeiro',
    gender: 'F',
    parents: ['octavio', 'magali'],
    spouses: ['tor'],
    children: ['lars', 'claudia', 'celina'],
  },

  // IRMÃOS LARS
  {
    id: 'claudia',
    name: 'Claudia Janér',
    birthDate: '28/06/1975',
    birthPlace: 'Rio de Janeiro',
    gender: 'F',
    parents: ['tor', 'edina'],
  },
  {
    id: 'celina',
    name: 'Celina Janér',
    birthDate: '27/08/1980',
    birthPlace: 'Rio de Janeiro',
    gender: 'F',
    parents: ['tor', 'edina'],
  },

  // AVÓS PATERNOS
  {
    id: 'lars-wilhelm',
    name: 'Lars Wilhelm Janér',
    birthDate: '23/08/1917',
    birthPlace: 'Estocolmo, Suécia',
    deathDate: '30/06/1987',
    deathPlace: 'Rio de Janeiro',
    gender: 'M',
    parents: ['tor-ewald', 'ruth'],
    spouses: ['teresa'],
    children: ['tor'],
  },
  {
    id: 'teresa',
    name: 'Teresa de Jesus de Verda y Mello de Castro',
    birthDate: '03/06/1919',
    birthPlace: 'Lisboa, Portugal',
    gender: 'F',
    parents: ['jose-verda', 'thereza-mello'],
    spouses: ['lars-wilhelm'],
    children: ['tor'],
  },

  // AVÓS MATERNOS
  {
    id: 'octavio',
    name: 'Octavio Gabizo de Faria',
    birthDate: '08/05/1920',
    birthPlace: 'Rio de Janeiro',
    gender: 'M',
    parents: ['adhemar', 'edina-faria'],
    spouses: ['magali'],
    children: ['edina'],
  },
  {
    id: 'magali',
    name: 'Magali Franco de Sá de Faria',
    birthDate: '30/03/1920',
    birthPlace: 'Rio de Janeiro',
    gender: 'F',
    parents: ['eneas', 'rachel-silva'],
    spouses: ['octavio'],
    children: ['edina'],
  },

  // BISAVÓS PATERNOS (JANÉR)
  {
    id: 'tor-ewald',
    name: 'Tor Ewald Wilhelm Janér',
    birthDate: '29/04/1887',
    birthPlace: 'Norrköping, Suécia',
    deathDate: '1957',
    deathPlace: 'Rio de Janeiro',
    gender: 'M',
    parents: ['anders-wilhelm', 'eva-albertina'],
    spouses: ['ruth'],
    children: ['lars-wilhelm'],
    notes: 'Fundou T. Janér no Brasil',
  },
  {
    id: 'ruth',
    name: 'Ruth Gerda Emilia Montelius',
    birthDate: '09/08/1887',
    birthPlace: 'Suécia',
    gender: 'F',
    parents: ['knut-montelius', 'maria-kylberg'],
    spouses: ['tor-ewald'],
    children: ['lars-wilhelm'],
  },

  // BISAVÓS PATERNOS (VERDA)
  {
    id: 'jose-verda',
    name: 'José de Verda Burnay',
    birthDate: '21/10/1894',
    birthPlace: 'Lisboa, Portugal',
    deathDate: '07/06/1950',
    deathPlace: 'São Paulo',
    gender: 'M',
    parents: ['luiz-verda', 'elisa-burnay'],
    spouses: ['thereza-mello'],
    children: ['teresa'],
  },
  {
    id: 'thereza-mello',
    name: 'Thereza de Mello y Castro',
    deathDate: '22/07/1984',
    deathPlace: 'Rio de Janeiro',
    gender: 'F',
    parents: ['jose-galveias', 'thereza-lencastre'],
    spouses: ['jose-verda'],
    children: ['teresa'],
  },

  // BISAVÓS MATERNOS (FARIA)
  {
    id: 'adhemar',
    name: 'Adhemar de Faria',
    birthDate: '12/04/1890',
    birthPlace: 'Petrópolis',
    gender: 'M',
    parents: ['zeferino-faria', 'alice-sa'],
    spouses: ['edina-faria'],
    children: ['octavio'],
    notes: 'Bacharel Direito RJ 1909',
  },
  {
    id: 'edina-faria',
    name: 'Edina Faria',
    birthDate: '01/08/1899',
    birthPlace: 'Rio de Janeiro',
    gender: 'F',
    parents: ['francisco-gabizo', 'amalia-gusmao'],
    spouses: ['adhemar'],
    children: ['octavio'],
  },

  // BISAVÓS MATERNOS (FRANCO DE SÁ)
  {
    id: 'eneas',
    name: 'Enéas Torreão Franco de Sá',
    birthPlace: 'Maranhão',
    gender: 'M',
    spouses: ['rachel-silva'],
    children: ['magali'],
  },
  {
    id: 'rachel-silva',
    name: 'Rachel Silva Franco de Sá',
    birthDate: '21/09/1895',
    birthPlace: 'Distrito Federal',
    gender: 'F',
    parents: ['eliseu-silva', 'rachel-luz'],
    spouses: ['eneas'],
    children: ['magali'],
  },

  // TRISAVÓS (JANSSON)
  {
    id: 'anders-wilhelm',
    name: 'Anders Wilhelm Jansson',
    birthDate: '28/12/1857',
    birthPlace: 'Tornby, Östergötland, Suécia',
    deathDate: '04/02/1927',
    deathPlace: 'Norrköping',
    gender: 'M',
    parents: ['anders-peter', 'mathilda-gran'],
    spouses: ['eva-albertina'],
    children: ['tor-ewald'],
    notes: 'Sobrenome mudou Jansson → Janér',
  },
  {
    id: 'eva-albertina',
    name: 'Eva Albertina Larsson',
    birthDate: '24/12/1864',
    birthPlace: 'Norrköping',
    deathDate: '16/10/1945',
    deathPlace: 'Estocolmo',
    gender: 'F',
    spouses: ['anders-wilhelm'],
    children: ['tor-ewald'],
  },

  // TRISAVÓS (MONTELIUS/KYLBERG)
  {
    id: 'knut-montelius',
    name: 'Knut Johan Montelius',
    gender: 'M',
    spouses: ['maria-kylberg'],
    children: ['ruth'],
  },
  {
    id: 'maria-kylberg',
    name: 'Maria Kylberg',
    birthDate: '1860',
    deathDate: '1919',
    gender: 'F',
    parents: ['hjalmar-kylberg', 'agnes-raab'],
    spouses: ['knut-montelius'],
    children: ['ruth'],
  },

  // TRISAVÓS (VERDA - VISCONDE DE MAIROS)
  {
    id: 'luiz-verda',
    name: 'D. Luiz de Verda y Gomé, 1º Visconde de Mairos',
    birthDate: '08/08/1850',
    birthPlace: 'Saragoça, Espanha',
    deathDate: '08/05/1922',
    deathPlace: 'Lisboa',
    gender: 'M',
    spouses: ['elisa-burnay'],
    children: ['jose-verda'],
    notes: '1º Visconde de Mairos',
  },
  {
    id: 'elisa-burnay',
    name: 'Elisa de Carvalho Burnay',
    birthDate: '12/07/1871',
    deathDate: '14/09/1935',
    gender: 'F',
    parents: ['henrique-burnay', 'amelia-carvalho'],
    spouses: ['luiz-verda'],
    children: ['jose-verda'],
  },

  // TRISAVÓS (CONDE DAS GALVEIAS)
  {
    id: 'jose-galveias',
    name: 'José de Avilez de Almeida Mello y Castro, 9º Conde das Galveias',
    birthDate: '05/10/1872',
    birthPlace: 'Cascais',
    gender: 'M',
    parents: ['jose-avilez', 'eugenia-melo'],
    spouses: ['thereza-lencastre'],
    children: ['thereza-mello'],
    notes: '9º Conde das Galveias',
  },
  {
    id: 'thereza-lencastre',
    name: 'Thereza Lencastre de Oliveira',
    gender: 'F',
    spouses: ['jose-galveias'],
    children: ['thereza-mello'],
  },

  // TRISAVÓS (FARIA)
  {
    id: 'zeferino-faria',
    name: 'Zeferino de Faria',
    gender: 'M',
    spouses: ['alice-sa'],
    children: ['adhemar'],
    notes: 'Advogado',
  },
  {
    id: 'alice-sa',
    name: 'Alice Sá de Faria',
    gender: 'F',
    spouses: ['zeferino-faria'],
    children: ['adhemar'],
  },

  // TRISAVÓS (GABIZO)
  {
    id: 'francisco-gabizo',
    name: 'Francisco Cordeiro Pizarro Gabizo',
    gender: 'M',
    spouses: ['amalia-gusmao'],
    children: ['edina-faria'],
  },
  {
    id: 'amalia-gusmao',
    name: 'Amalia Gusmão',
    gender: 'F',
    spouses: ['francisco-gabizo'],
    children: ['edina-faria'],
  },

  // TRISAVÓS (SILVA)
  {
    id: 'eliseu-silva',
    name: 'Eliseu Guilherme da Silva',
    gender: 'M',
    spouses: ['rachel-luz'],
    children: ['rachel-silva'],
  },
  {
    id: 'rachel-luz',
    name: 'Rachel Pinto da Luz e Silva',
    gender: 'F',
    spouses: ['eliseu-silva'],
    children: ['rachel-silva'],
  },

  // 4ª GERAÇÃO (JANSSON)
  {
    id: 'anders-peter',
    name: 'Anders Peter Jansson',
    birthDate: '03/10/1818',
    gender: 'M',
    parents: ['jan-jansson', 'maja-andersdotter'],
    spouses: ['mathilda-gran'],
    children: ['anders-wilhelm'],
  },
  {
    id: 'mathilda-gran',
    name: 'Mathilda Gran',
    birthDate: '07/06/1824',
    gender: 'F',
    spouses: ['anders-peter'],
    children: ['anders-wilhelm'],
  },

  // 4ª GERAÇÃO (KYLBERG)
  {
    id: 'hjalmar-kylberg',
    name: 'Hjalmar Kylberg',
    birthDate: '1824',
    deathDate: '1885',
    gender: 'M',
    parents: ['lars-kylberg', 'maria-ahlberg'],
    spouses: ['agnes-raab'],
    children: ['maria-kylberg'],
  },
  {
    id: 'agnes-raab',
    name: 'Agnes Raab',
    birthDate: '1830',
    deathDate: '1873',
    gender: 'F',
    parents: ['adam-raab', 'caroline-fleetwood'],
    spouses: ['hjalmar-kylberg'],
    children: ['maria-kylberg'],
  },

  // 4ª GERAÇÃO (BURNAY - CONDE)
  {
    id: 'henrique-burnay',
    name: 'Henrique Burnay, 1º Conde de Burnay',
    birthDate: '07/01/1838',
    birthPlace: 'Lisboa',
    deathDate: '29/03/1909',
    deathPlace: 'Lisboa',
    gender: 'M',
    spouses: ['amelia-carvalho'],
    children: ['elisa-burnay'],
    notes: '1º Conde de Burnay',
  },
  {
    id: 'amelia-carvalho',
    name: 'Amélia de Carvalho',
    birthDate: '20/02/1847',
    gender: 'F',
    spouses: ['henrique-burnay'],
    children: ['elisa-burnay'],
  },

  // 4ª GERAÇÃO (GALVEIAS - PAIS)
  {
    id: 'jose-avilez',
    name: 'José Ferreira Pinto de Avlez Juzarte de Souza Tavares',
    birthDate: '09/08/1849',
    gender: 'M',
    spouses: ['eugenia-melo'],
    children: ['jose-galveias'],
  },
  {
    id: 'eugenia-melo',
    name: 'Eugénia Maria Lobo de Almeida Melo e Castro',
    birthDate: '29/10/1846',
    gender: 'F',
    spouses: ['jose-avilez'],
    children: ['jose-galveias'],
  },

  // 5ª GERAÇÃO (JANSSON)
  {
    id: 'jan-jansson',
    name: 'Jan Jansson',
    birthDate: '29/07/1793',
    gender: 'M',
    spouses: ['maja-andersdotter'],
    children: ['anders-peter'],
  },
  {
    id: 'maja-andersdotter',
    name: 'Maja Andersdotter',
    birthDate: '14/02/1793',
    gender: 'F',
    spouses: ['jan-jansson'],
    children: ['anders-peter'],
  },

  // 5ª GERAÇÃO (KYLBERG)
  {
    id: 'lars-kylberg',
    name: 'Lars Wilhelm Kylberg',
    birthDate: '1798',
    deathDate: '1865',
    gender: 'M',
    spouses: ['maria-ahlberg'],
    children: ['hjalmar-kylberg'],
  },
  {
    id: 'maria-ahlberg',
    name: 'Maria Ahlberg',
    birthDate: '1798',
    deathDate: '1874',
    gender: 'F',
    spouses: ['lars-kylberg'],
    children: ['hjalmar-kylberg'],
  },

  // 5ª GERAÇÃO (RAAB/FLEETWOOD - NOBREZA)
  {
    id: 'adam-raab',
    name: 'Adam Christian Raab',
    birthDate: '1801',
    deathDate: '1872',
    gender: 'M',
    spouses: ['caroline-fleetwood'],
    children: ['agnes-raab'],
  },
  {
    id: 'caroline-fleetwood',
    name: 'Caroline Fleetwood',
    birthDate: '1800',
    deathDate: '1837',
    gender: 'F',
    parents: ['fredrik-fleetwood'],
    spouses: ['adam-raab'],
    children: ['agnes-raab'],
    notes: 'Família nobre sueca',
  },

  // 6ª GERAÇÃO (FLEETWOOD)
  {
    id: 'fredrik-fleetwood',
    name: 'Fredrik Wilhelm Fleetwood',
    birthDate: '1773',
    deathDate: '1835',
    gender: 'M',
    parents: ['carl-hartvig-fleetwood'],
    children: ['caroline-fleetwood'],
  },

  // 7ª GERAÇÃO (FLEETWOOD)
  {
    id: 'carl-hartvig-fleetwood',
    name: 'Carl Hartvig Fleetwood',
    birthDate: '1742',
    deathDate: '1824',
    gender: 'M',
    parents: ['carl-marten-fleetwood'],
    children: ['fredrik-fleetwood'],
  },

  // 8ª GERAÇÃO (FLEETWOOD)
  {
    id: 'carl-marten-fleetwood',
    name: 'Carl Mårten Fleetwood',
    birthDate: '1703',
    deathDate: '1751',
    gender: 'M',
    parents: ['georg-fleetwood'],
    children: ['carl-hartvig-fleetwood'],
  },

  // 9ª GERAÇÃO (FLEETWOOD - ORIGEM SÉCULO XVII)
  {
    id: 'georg-fleetwood',
    name: 'Georg Wilhelm Fleetwood',
    birthDate: '1669',
    deathDate: '1728',
    gender: 'M',
    children: ['carl-marten-fleetwood'],
    notes: 'Nobreza sueca - século XVII',
  },

  // LADO ANDREA - PAIS
  {
    id: 'antonio-melegari',
    name: 'Antonio Celso Melegari',
    birthDate: '13/06/1939',
    birthPlace: 'Marcelino Ramos, RS',
    gender: 'M',
    parents: ['orlando-melegari', 'iracema'],
    spouses: ['maria-alice'],
    children: ['andrea'],
  },
  {
    id: 'maria-alice',
    name: 'Maria Alice de Castro Melegari',
    gender: 'F',
    parents: ['flavio-castro', 'maria-julia'],
    spouses: ['antonio-melegari'],
    children: ['andrea'],
  },

  // AVÓS MELEGARI
  {
    id: 'orlando-melegari',
    name: 'Orlando Melegari',
    birthDate: '20/07/1915',
    gender: 'M',
    parents: ['luigi-melegaro', 'corinna-rinaldi'],
    spouses: ['iracema'],
    children: ['antonio-melegari'],
  },
  {
    id: 'iracema',
    name: 'Iracema Garib',
    birthDate: '31/07/1918',
    gender: 'F',
    parents: ['antonio-garib', 'carolina-vieira'],
    spouses: ['orlando-melegari'],
    children: ['antonio-melegari'],
  },

  // BISAVÓS MELEGARI (ITÁLIA)
  {
    id: 'luigi-melegaro',
    name: 'Luigi Melegaro',
    birthPlace: 'Verona, Itália',
    gender: 'M',
    spouses: ['corinna-rinaldi'],
    children: ['orlando-melegari'],
  },
  {
    id: 'corinna-rinaldi',
    name: 'Corinna Rinaldi Melegaro',
    birthPlace: 'Itália',
    gender: 'F',
    spouses: ['luigi-melegaro'],
    children: ['orlando-melegari'],
  },

  // BISAVÓS GARIB (SÍRIA)
  {
    id: 'antonio-garib',
    name: 'Antonio Garib',
    birthPlace: 'Síria',
    gender: 'M',
    spouses: ['carolina-vieira'],
    children: ['iracema'],
  },
  {
    id: 'carolina-vieira',
    name: 'Carolina Vieira de Carvalho',
    birthPlace: 'Brasil',
    gender: 'F',
    spouses: ['antonio-garib'],
    children: ['iracema'],
  },

  // AVÓS CASTRO
  {
    id: 'flavio-castro',
    name: 'Flavio Dias de Castro',
    birthDate: '22/06/1913',
    gender: 'M',
    parents: ['franklin-castro', 'etelvina-castro'],
    spouses: ['maria-julia'],
    children: ['maria-alice'],
  },
  {
    id: 'maria-julia',
    name: 'Maria Julia Ramos de Castro',
    birthDate: '20/12/1920',
    birthPlace: 'Lages',
    deathDate: '21/04/2000',
    deathPlace: 'Lages',
    gender: 'F',
    parents: ['henrique-ramos-jr', 'maria-esprito-santo'],
    spouses: ['flavio-castro'],
    children: ['maria-alice'],
  },

  // BISAVÓS CASTRO
  {
    id: 'franklin-castro',
    name: 'Franklin Dias de Castro',
    gender: 'M',
    spouses: ['etelvina-castro'],
    children: ['flavio-castro'],
  },
  {
    id: 'etelvina-castro',
    name: 'Etelvina Dias de Castro',
    gender: 'F',
    spouses: ['franklin-castro'],
    children: ['flavio-castro'],
  },

  // BISAVÓS RAMOS
  {
    id: 'henrique-ramos-jr',
    name: 'Henrique Ramos Júnior',
    gender: 'M',
    parents: ['henrique-ramos'],
    spouses: ['maria-esprito-santo'],
    children: ['maria-julia'],
  },
  {
    id: 'maria-esprito-santo',
    name: 'Maria do Espírito Santo Arruda Ramos',
    birthDate: '13/05',
    birthPlace: 'Lages',
    gender: 'F',
    parents: ['jose-arruda', 'agueda-arruda'],
    spouses: ['henrique-ramos-jr'],
    children: ['maria-julia'],
  },

  // TRISAVÓS RAMOS
  {
    id: 'henrique-ramos',
    name: 'Henrique de Oliveira Ramos',
    gender: 'M',
    children: ['henrique-ramos-jr'],
  },

  // TRISAVÓS ARRUDA
  {
    id: 'jose-arruda',
    name: 'José Maria Arruda',
    gender: 'M',
    spouses: ['agueda-arruda'],
    children: ['maria-esprito-santo'],
  },
  {
    id: 'agueda-arruda',
    name: 'Agueda Dolores Arruda',
    gender: 'F',
    spouses: ['jose-arruda'],
    children: ['maria-esprito-santo'],
  },
];

// Helper: achar pessoa por ID
export function getPerson(id: string): Person | undefined {
  return familyData.find(p => p.id === id);
}

// Helper: pegar filhos de uma pessoa
export function getChildren(id: string): Person[] {
  const person = getPerson(id);
  if (!person?.children) return [];
  return person.children.map(getPerson).filter((p): p is Person => !!p);
}

// Helper: pegar pais de uma pessoa
export function getParents(id: string): Person[] {
  const person = getPerson(id);
  if (!person?.parents) return [];
  return person.parents.map(getPerson).filter((p): p is Person => !!p);
}

// Helper: pegar cônjuge(s)
export function getSpouses(id: string): Person[] {
  const person = getPerson(id);
  if (!person?.spouses) return [];
  return person.spouses.map(getPerson).filter((p): p is Person => !!p);
}
