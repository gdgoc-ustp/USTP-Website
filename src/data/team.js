import sampleImage from '../assets/sample.png';

// Shared team data source
// featured: true = shows in AboutUs preview (first 3)
// group: Executives, Operations, Technology, Communications, Community Development

export const teamMembers = [
    // Executives (Featured in preview)
    {
        id: 'exec-1',
        name: 'Hannah Dennisse Aque',
        role: 'Chief Operating Officer',
        title: 'Executive',
        image: '/output/Operations/hannah-aque.webp',
        group: 'Executives',
        order: 1,
        featured: true,
        alt: 'Hannah Dennisse Aque - Chief Operating Officer'
    },
    {
        id: 'exec-2',
        name: 'Kent Jasper Sisi',
        role: 'Chief Technology Officer',
        title: 'Executive',
        image: '/output/Technology/kent-sisi.webp',
        group: 'Executives',
        order: 2,
        featured: true,
        alt: 'Kent Jasper Sisi - Chief Technology Officer'
    },
    {
        id: 'exec-3',
        name: 'Jewel Rose Daguinotas',
        role: 'Chief Communications Officer',
        title: 'Executive',
        image: '/output/Communications/jewel-daguinotas.webp',
        group: 'Executives',
        order: 3,
        featured: true,
        alt: 'Jewel Rose Daguinotas - Chief Communications Officer'
    },
    {
        id: 'exec-4',
        name: 'John Derek Antillon',
        role: 'Executive',
        title: 'Executive',
        image: '/output/Operations/john-antillon.webp',
        group: 'Executives',
        order: 4,
        featured: false,
        alt: 'John Derek Antillon - Executive'
    },
    {
        id: 'exec-5',
        name: 'Vinz Verbo Aliling',
        role: 'Chief Community Development Officer',
        title: 'Executive',
        image: '/output/Community Development/vinz-aliling.webp',
        group: 'Executives',
        order: 5,
        featured: false,
        alt: 'Vinz Verbo Aliling - Chief Community Development Officer'
    },

    // Operations
    {
        id: 'ops-1',
        name: 'John Derek Antillon',
        role: 'Chief Operations Officer',
        title: 'Operations Lead',
        image: '/output/Operations/john-antillon.webp',
        group: 'Operations',
        order: 1,
        featured: false,
        alt: 'John Derek Antillon - Chief Operations Officer'
    },
    {
        id: 'ops-2',
        name: 'Ma. Carla Neil Floresca',
        role: 'Administrative Officer',
        title: 'Operations',
        image: '/output/Operations/carla-floresca.webp',
        group: 'Operations',
        order: 2,
        featured: false,
        alt: 'Ma. Carla Neil Floresca - Administrative Officer'
    },
    {
        id: 'ops-3',
        name: 'Cassandra Louisse Caneos',
        role: 'Internal Relations Officer',
        title: 'Operations',
        image: '/output/Operations/cassandra-caneos.webp',
        group: 'Operations',
        order: 3,
        featured: false,
        alt: 'Cassandra Louisse Caneos - Internal Relations Officer'
    },
    {
        id: 'ops-4',
        name: 'Axel Marujuh',
        role: 'External Relations Officer',
        title: 'Operations',
        image: '/output/Operations/axel-marujuh.webp',
        group: 'Operations',
        order: 4,
        featured: false,
        alt: 'Axel Marujuh - External Relations Officer'
    },
    {
        id: 'ops-5',
        name: 'Mary Lourdes Ugat',
        role: 'Finance Audit',
        title: 'Operations',
        image: sampleImage,
        group: 'Operations',
        order: 5,
        featured: false,
        alt: 'Mary Lourdes Ugat - Finance Audit'
    },
    {
        id: 'ops-6',
        name: 'Ysabelle Grace Cagalawan',
        role: 'Secretariat Ambassador',
        title: 'Operations',
        image: '/output/Operations/ysabelle-cagalawan.webp',
        group: 'Operations',
        order: 6,
        featured: false,
        alt: 'Ysabelle Grace Cagalawan - Secretariat Ambassador'
    },
    {
        id: 'ops-7',
        name: 'Marc Ahron Alfar',
        role: 'Project Coordinator',
        title: 'Operations',
        image: '/output/Operations/alfar.JPG',
        group: 'Operations',
        order: 7,
        featured: false,
        alt: 'Marc Ahron Alfar - Project Coordinator'
    },
    {
        id: 'ops-8',
        name: 'Noren Rey Paclibar',
        role: 'Project Coordinator',
        title: 'Operations',
        image: '/output/Operations/paclibar.JPG',
        group: 'Operations',
        order: 8,
        featured: false,
        alt: 'Noren Rey Paclibar - Project Coordinator'
    },
    {
        id: 'ops-9',
        name: 'Keira Chloe Culaniban',
        role: 'Ambassador for Sponsorships',
        title: 'Operations',
        image: '/output/Operations/chloe-culaniban.webp',
        group: 'Operations',
        order: 9,
        featured: false,
        alt: 'Keira Chloe Culaniban - Ambassador for Sponsorships'
    },
    {
        id: 'ops-10',
        name: 'Ythan Kyle Mercader',
        role: 'Ambassador for Sponsorships',
        title: 'Operations',
        image: '/output/Operations/ythan-mercader.webp',
        group: 'Operations',
        order: 10,
        featured: false,
        alt: 'Ythan Kyle Mercader - Ambassador for Sponsorships'
    },

    // Technology
    {
        id: 'tech-1',
        name: 'Kent Jasper Sisi',
        role: 'Chief Technology Officer',
        title: 'Technology Lead',
        image: '/output/Technology/kent-sisi.webp',
        group: 'Technology',
        order: 1,
        featured: false,
        alt: 'Kent Jasper Sisi - Chief Technology Officer'
    },
    {
        id: 'tech-2',
        name: 'Janni Ornel B. Sarmago',
        role: 'Mobile Development Officer',
        title: 'Technology',
        image: '/output/Technology/janni-sarmago.webp',
        group: 'Technology',
        order: 2,
        featured: false,
        alt: 'Janni Ornel B. Sarmago - Mobile Development Officer'
    },
    {
        id: 'tech-3',
        name: 'Fvienj Nopuente',
        role: 'Web Development Officer',
        title: 'Technology',
        image: '/output/Technology/fvienj-nopuente.webp',
        group: 'Technology',
        order: 3,
        featured: false,
        alt: 'Fvienj Nopuente - Web Development Officer'
    },
    {
        id: 'tech-4',
        name: 'Brylle Cabunoc Palao',
        role: 'Computer Engineering Lead',
        title: 'Technology',
        image: '/output/Technology/brylle-palao.webp',
        group: 'Technology',
        order: 4,
        featured: false,
        alt: 'Brylle Cabunoc Palao - Computer Engineering Lead'
    },
    {
        id: 'tech-5',
        name: 'Bryll Bryan Pon',
        role: 'Computer Science Lead',
        title: 'Technology',
        image: '/output/Technology/bryll-pon.png',
        group: 'Technology',
        order: 5,
        featured: false,
        alt: 'Bryll Bryan Pon - Computer Science Lead'
    },
    {
        id: 'tech-6',
        name: 'Jiroh Bontilao',
        role: 'Data Science Lead',
        title: 'Technology',
        image: '/output/Technology/jiroh-bontilao.webp',
        group: 'Technology',
        order: 6,
        featured: false,
        alt: 'Jiroh Bontilao - Data Science Lead'
    },
    {
        id: 'tech-7',
        name: 'Alwyn Josh Aniez',
        role: 'Electronics Engineering Lead',
        title: 'Technology',
        image: '/output/Technology/alwyn-aniez.webp',
        group: 'Technology',
        order: 7,
        featured: false,
        alt: 'Alwyn Josh Aniez - Electronics Engineering Lead'
    },
    {
        id: 'tech-8',
        name: 'John Lemar Gonzales',
        role: 'Information Technology Lead',
        title: 'Technology',
        image: '/output/Technology/john_lemar-gonzales.webp',
        group: 'Technology',
        order: 8,
        featured: false,
        alt: 'John Lemar Gonzales - Information Technology Lead'
    },
    {
        id: 'tech-9',
        name: 'Alinor Casidar',
        role: 'Computer Engineering Ambassador',
        title: 'Technology',
        image: '/output/Technology/alinor-casidar.webp',
        group: 'Technology',
        order: 9,
        featured: false,
        alt: 'Alinor Casidar - Computer Engineering Ambassador'
    },
    {
        id: 'tech-10',
        name: 'Mitch Dumdum',
        role: 'Computer Science Ambassador',
        title: 'Technology',
        image: '/output/Technology/mitch-dumdum.webp',
        group: 'Technology',
        order: 10,
        featured: false,
        alt: 'Mitch Dumdum - Computer Science Ambassador'
    },
    {
        id: 'tech-11',
        name: 'Raven Siglos',
        role: 'Data Science Ambassador',
        title: 'Technology',
        image: '/output/Technology/raven-siglos.webp',
        group: 'Technology',
        order: 11,
        featured: false,
        alt: 'Raven Siglos - Data Science Ambassador'
    },
    {
        id: 'tech-12',
        name: 'Wayne Llacuna',
        role: 'Electronics Engineering Ambassador',
        title: 'Technology',
        image: '/output/Technology/wayne-llacuna.webp',
        group: 'Technology',
        order: 12,
        featured: false,
        alt: 'Wayne Obial - Electronics Engineering Ambassador'
    },
    {
        id: 'tech-13',
        name: 'Luke Zichri P. Cabatingan',
        role: 'Information Technology Ambassador',
        title: 'Technology',
        image: '/output/Technology/luke-cabatingan.webp',
        group: 'Technology',
        order: 13,
        featured: false,
        alt: 'Luke Zichri P. Cabatingan - Information Technology Ambassador'
    },

    // Communications
    {
        id: 'comm-1',
        name: 'Jewel Rose Daguinotas',
        role: 'Chief Communications Officer',
        title: 'Communications Lead',
        image: '/output/Communications/jewel-daguinotas.webp',
        group: 'Communications',
        order: 1,
        featured: false,
        alt: 'Jewel Rose Daguinotas - Chief Communications Officer'
    },
    {
        id: 'comm-2',
        name: 'Jazzel Jean Gentrolizo',
        role: 'Documentations Lead',
        title: 'Communications',
        image: '/output/Communications/jazzel-gentrolizo.webp',
        group: 'Communications',
        order: 2,
        featured: false,
        alt: 'Jazzel Jean Gentrolizo - Documentations Lead'
    },
    {
        id: 'comm-3',
        name: 'Ken Adrean Tupino',
        role: 'Creatives Lead',
        title: 'Communications',
        image: '/output/Communications/ken-tupino.webp',
        group: 'Communications',
        order: 3,
        featured: false,
        alt: 'Ken Adrean Tupino - Creatives Lead'
    },
    {
        id: 'comm-4',
        name: 'Samantha Lewis Roldan',
        role: 'Promotions Lead',
        title: 'Communications',
        image: '/output/Communications/samantha-roldan.webp',
        group: 'Communications',
        order: 4,
        featured: false,
        alt: 'Samantha Lewis Roldan - Promotions Lead'
    },
    {
        id: 'comm-5',
        name: 'Willem Quion Tion',
        role: 'Photography Ambassador',
        title: 'Communications',
        image: '/output/Communications/willem-tion.webp',
        group: 'Communications',
        order: 5,
        featured: false,
        alt: 'Willem Quion Tion - Photography Ambassador'
    },
    {
        id: 'comm-6',
        name: 'Jon Mc Rogel Cailing IV',
        role: 'Graphic Artist',
        title: 'Communications',
        image: '/output/Communications/rogel-cailing.webp',
        group: 'Communications',
        order: 6,
        featured: false,
        alt: 'Jon Mc Rogel Cailing IV - Graphic Artist'
    },
    {
        id: 'comm-7',
        name: 'Gianne Louqias',
        role: 'Graphic Artist',
        title: 'Communications',
        image: sampleImage,
        group: 'Communications',
        order: 7,
        featured: false,
        alt: 'Gianne Louqias - Graphic Artist'
    },
    {
        id: 'comm-8',
        name: 'Alexa Maureal',
        role: 'Graphic Designer',
        title: 'Communications',
        image: '/output/Communications/alexa-maureal.webp',
        group: 'Communications',
        order: 8,
        featured: false,
        alt: 'Alexa Maureal - Graphic Designer'
    },
    {
        id: 'comm-9',
        name: 'Flor Angel Saromines',
        role: 'Graphic Designer',
        title: 'Communications',
        image: sampleImage,
        group: 'Communications',
        order: 9,
        featured: false,
        alt: 'Flor Angel Saromines - Graphic Designer'
    },
    {
        id: 'comm-10',
        name: 'Princess Heart Danila Aguid',
        role: 'Graphic Designer',
        title: 'Communications',
        image: sampleImage,
        group: 'Communications',
        order: 10,
        featured: false,
        alt: 'Princess Heart Danila Aguid - Graphic Designer'
    },
    {
        id: 'comm-11',
        name: 'Rey Angelo Sales',
        role: 'Animation and Motion Graphics',
        title: 'Communications',
        image: '/output/Communications/rey-angelo-sales.webp',
        group: 'Communications',
        order: 11,
        featured: false,
        alt: 'Rey Angelo Sales - Animation and Motion Graphics'
    },
    {
        id: 'comm-12',
        name: 'Mabi Akut',
        role: 'Associate Documentation Lead',
        title: 'Communications',
        image: '/output/Communications/mabi-akut.webp',
        group: 'Communications',
        order: 12,
        featured: false,
        alt: 'Mabi Akut - Associate Documentation Lead'
    },
    {
        id: 'comm-13',
        name: 'Jester Dellosa Jr.',
        role: 'Technical Ambassador',
        title: 'Communications',
        image: '/output/Communications/jester-dellosa.webp',
        group: 'Communications',
        order: 13,
        featured: false,
        alt: 'Jester Dellosa Jr. - Technical Ambassador'
    },
    {
        id: 'comm-14',
        name: 'Hanisa Rogong',
        role: 'Marketing Ambassador',
        title: 'Communications',
        image: '/output/Communications/hanisa-rogong.webp',
        group: 'Communications',
        order: 14,
        featured: false,
        alt: 'Hanisa Rogong - Marketing Ambassador'
    },
    {
        id: 'comm-15',
        name: 'Kein Euhann Cruz',
        role: 'Marketing Ambassador',
        title: 'Communications',
        image: '/output/Communications/euhann-cruz.webp',
        group: 'Communications',
        order: 15,
        featured: false,
        alt: 'Kein Euhann Cruz - Marketing Ambassador'
    },

    // Community Development
    {
        id: 'cd-1',
        name: 'Vinz Verbo A. Aliling',
        role: 'Chief Community Development Officer',
        title: 'Community Development Lead',
        image: '/output/Community Development/vinz-aliling.webp',
        group: 'Community Development',
        order: 1,
        featured: false,
        alt: 'Vinz Verbo A. Aliling - Chief Community Development Officer'
    },
    {
        id: 'cd-2',
        name: 'Kristine Joy D. Dandasan',
        role: 'Community Formations Officer',
        title: 'Community Development',
        image: '/output/Community Development/kristine-dandasan.webp',
        group: 'Community Development',
        order: 2,
        featured: false,
        alt: 'Kristine Joy D. Dandasan - Community Formations Officer'
    },
    {
        id: 'cd-3',
        name: 'Julz Christian J. Plaza',
        role: 'Community Relations Officer',
        title: 'Community Development',
        image: '/output/Community Development/julz-plaza.webp',
        group: 'Community Development',
        order: 3,
        featured: false,
        alt: 'Julz Christian J. Plaza - Community Relations Officer'
    },
    {
        id: 'cd-4',
        name: 'Kyle Nelson Leonor',
        role: 'Community Formations Officer',
        title: 'Community Development',
        image: '/output/Community Development/kyle-leonor.webp',
        group: 'Community Development',
        order: 4,
        featured: false,
        alt: 'Kyle Nelson Leonor - Community Formations Officer'
    },
    {
        id: 'cd-5',
        name: 'Lode Reinhold Naldo Ebabacol',
        role: 'Community Relations Officer',
        title: 'Community Development',
        image: '/output/Community Development/lode-ebabacol.webp',
        group: 'Community Development',
        order: 5,
        featured: false,
        alt: 'Lode Reinhold Naldo Ebabacol - Community Relations Officer'
    },
    {
        id: 'cd-6',
        name: 'Rhudd Lawrence',
        role: 'Community Relations Officer',
        title: 'Community Development',
        image: '/output/Community Development/rhudd-cagatan.webp',
        group: 'Community Development',
        order: 6,
        featured: false,
        alt: 'Rhudd Lawrence - Community Relations Officer'
    },
    {
        id: 'cd-7',
        name: 'Friylle Pescones',
        role: 'Community Formations Officer',
        title: 'Community Development',
        image: '/output/Community Development/friylle-pescones.webp',
        group: 'Community Development',
        order: 7,
        featured: false,
        alt: 'Friylle Pescones - Community Formations Officer'
    },
    {
        id: 'cd-8',
        name: 'Maria Wiona Deondo',
        role: 'Community Relations Ambassador',
        title: 'Community Development',
        image: '/output/Community Development/wiona-deondo.webp',
        group: 'Community Development',
        order: 8,
        featured: false,
        alt: 'Maria Wiona Deondo - Community Relations Ambassador'
    },
    {
        id: 'cd-9',
        name: 'Remiel Charles O. Fugnit',
        role: 'Community Relations Ambassador',
        title: 'Community Development',
        image: '/output/Community Development/remiel-fugnit.webp',
        group: 'Community Development',
        order: 9,
        featured: false,
        alt: 'Remiel Charles O. Fugnit - Community Relations Ambassador'
    },
    {
        id: 'cd-10',
        name: 'Eilkim Jasper Dela Cuesta',
        role: 'Community Formations Ambassador',
        title: 'Community Development',
        image: '/output/Community Development/elkim-dela-cuesta.webp',
        group: 'Community Development',
        order: 10,
        featured: false,
        alt: 'Eilkim Jasper Dela Cuesta - Community Formations Ambassador'
    },
    {
        id: 'cd-11',
        name: 'Chrizamae Allysa Lastimosa',
        role: 'Community Relations Ambassador',
        title: 'Community Development',
        image: '/output/Community Development/chrizamae-lastimosa.webp',
        group: 'Community Development',
        order: 11,
        featured: false,
        alt: 'Chrizamae Allysa Lastimosa - Community Relations Ambassador'
    },
    {
        id: 'cd-12',
        name: 'Junlie Caliso',
        role: 'Community Formations Ambassador',
        title: 'Community Development',
        image: '/output/Community Development/junlie-caliso.webp',
        group: 'Community Development',
        order: 12,
        featured: false,
        alt: 'Junlie Caliso - Community Formations Ambassador'
    },
    {
        id: 'cd-13',
        name: 'Kathleen Advincula',
        role: 'Community Relations Ambassador',
        title: 'Community Development',
        image: '/output/Community Development/kathleen-advinclua.webp',
        group: 'Community Development',
        order: 13,
        featured: false,
        alt: 'Kathleen Advincula - Community Relations Ambassador'
    },
    {
        id: 'cd-14',
        name: 'Chysney Gaid',
        role: 'Community Formations Ambassador',
        title: 'Community Development',
        image: '/output/Community Development/chysney-gaid.webp',
        group: 'Community Development',
        order: 14,
        featured: false,
        alt: 'Chysney Gaid - Community Formations Ambassador'
    }
];

// Helper functions
export const getFeaturedMembers = (limit = 3) => {
    return teamMembers
        .filter(member => member.featured)
        .sort((a, b) => a.order - b.order)
        .slice(0, limit);
};

export const getTeamByGroup = () => {
    const groups = {};
    teamMembers.forEach(member => {
        if (!groups[member.group]) {
            groups[member.group] = [];
        }
        groups[member.group].push(member);
    });
    
    // Sort members within each group by order
    Object.keys(groups).forEach(group => {
        groups[group].sort((a, b) => a.order - b.order);
    });
    
    return groups;
};

export const getAllGroups = () => {
    return ['Executives', 'Operations', 'Technology', 'Communications', 'Community Development'];
};

// Google Developer Colors for each group
export const getGroupColor = (group) => {
    const colorMap = {
        'Executives': '#498CF6',        // Blue
        'Operations': '#498CF6',        // Blue (same as Executives)
        'Technology': '#EB483B',        // Red
        'Communications': '#FBC10E',    // Yellow
        'Community Development': '#4EA865'  // Green
    };
    return colorMap[group] || '#498CF6'; // Default to blue
};
