export const rolesDictionary: { [id:string]:string[]} = {
    "gerente"   : ["fornecedores", "produtos","clientes","pedidos","pagamentos","funcionarios","remessas"],
    "cliente"   : ["produtos","clientes","pedidos","pagamentos"],
    "caixa"     : ["produtos","clientes","pedidos","pagamentos","funcionarios"],
    "repositor" : ["fornecedores", "produtos", "funcionarios","remessas"],
}

export const capitalize = (str:string) => {
    return str.charAt(0).toUpperCase() + str.slice(1);
}