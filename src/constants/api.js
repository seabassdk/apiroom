// FOR DEVELOPMENT
export const register = 'http://localhost:3010/user/register';
export const login = 'http://localhost:3010/user/login';

export const saveContractUri = 'http://localhost:3010/data/save/contract';
export const saveTypeUri = 'http://localhost:3010/data/save/'; //:type

export const loadContractsUri = 'http://localhost:3010/data/load/contracts';
export const loadTypeUri = 'http://localhost:3010/data/load/'; // :type

export const updateContractUri = 'http://localhost:3010/data/update/contract/'; // :index
export const updateContractByindexUri = 'http://localhost:3010/data/update/contractfield/'; // :index
export const updateTypeUri = 'http://localhost:3010/data/update/'; //:type/:index/:field

export const deleteContractByIndexUri = 'http://localhost:3010/data/delete/contract/'; //:index

export const switchContractByIndexUri = 'http://localhost:3010/data/contract/switch/'; //:index

export const linkToSwaggerUri = 'http://localhost:3010/docs/'; //:username

export const getDockerFileUri = 'http://localhost:3010/docker/';

// FOR PRODUCTION
// export const register = '/user/register';
// export const login = '/user/login';

// export const saveContractUri = '/data/save/contract';
// export const saveTypeUri = '/data/save/'; //:type

// export const loadContractsUri = '/data/load/contracts';
// export const loadTypeUri = '/data/load/'; // :type

// export const updateContractUri ='/data/update/contract/'; // :index
// export const updateContractByindexUri ='/data/update/contractfield/'; // :index
// export const updateTypeUri = '/data/update/'; //:type/:index/:field

// export const deleteContractByIndexUri =  '/data/delete/contract/'; //:index

// export const switchContractByIndexUri =  '/data/contract/switch/'; //:index

// export const linkToSwaggerUri = '/docs/'; //:username

// export const getDockerFileUri = '/docker/';