class Despesa{
    constructor(ano, mes, dia, tipo, descricao, valor){
        this.ano = ano
        this.mes = mes
        this.dia = dia
        this.tipo = tipo
        this.descricao = descricao
        this.valor = valor
    }

    validarDados(){
        for(let i in this){
            if(this[i]=='' || this[i]==undefined || this[i]==null){ //Também poderia ser somente if(this[i]). Porém para manter mais didático, irei manter da forma que está.
                return false
            }
        }
        return true
    }
}



class Bd{
    gerarProximoId(){
        if(localStorage.getItem('id')){
            localStorage.setItem('id', parseInt(localStorage.getItem('id'))+1)
        }else{
            localStorage.setItem('id', 0)
        }
    }

    registrarDespesa(d){
        localStorage.setItem(localStorage.getItem('id'), JSON.stringify(d))
    }

    recuperarDespesas(){
        let despesas = Array()
        let id = parseInt(localStorage.getItem('id'))
        for(let i=0;i<=id;i++){
            let despesa = JSON.parse(localStorage.getItem(i))
            if(despesa==null){
                continue
            }
            despesa.id= i
            despesas.push(despesa)
        }
        return despesas
    }

    pesquisar(despesa){
        let despesasFiltradas = new Array()
        despesasFiltradas = this.recuperarDespesas()

        if(despesa.ano != ''){
            despesasFiltradas = despesasFiltradas.filter(v => v.ano == despesa.ano)
        }

        if(despesa.mes != ''){
            despesasFiltradas = despesasFiltradas.filter(v => v.mes == despesa.mes)
        }

        if(despesa.dia != ''){
            despesasFiltradas = despesasFiltradas.filter(v => v.dia == despesa.dia)
        }

        if(despesa.tipo != ''){
            despesasFiltradas = despesasFiltradas.filter(v => v.tipo == despesa.tipo)
        }

        if(despesa.descricao != ''){
            despesasFiltradas = despesasFiltradas.filter(v => v.descricao == despesa.descricao)
        }

        if(despesa.valor != ''){
            despesasFiltradas = despesasFiltradas.filter(v => v.valor == despesa.valor)
        }

        return despesasFiltradas
    }

    remover(id){
        localStorage.removeItem(id)
    }

}

let banco = new Bd()

function limparFormulario(){
    document.getElementById('ano').value=''
    document.getElementById('mes').value=''
    document.getElementById('dia').value=''
    document.getElementById('tipo').value=''
    document.getElementById('descricao').value=''
    document.getElementById('valor').value=''
}

function cadastrarDespesa(){
    let ano = document.getElementById('ano')
    let mes = document.getElementById('mes')
    let dia = document.getElementById('dia')
    let tipo = document.getElementById('tipo')
    let descricao = document.getElementById('descricao')
    let valor = document.getElementById('valor')

    let despesa = new Despesa(ano.value, mes.value, dia.value, tipo.value, descricao.value, valor.value)

    if(despesa.validarDados()){
        banco.gerarProximoId()
        banco.registrarDespesa(despesa)
        limparFormulario()
        document.getElementById('modal_titulo').innerHTML = 'Registro efetuado com sucesso!'
        document.getElementById('modal_conteudo').innerHTML = 'A despesa foi cadastrada no sistema.'
        document.getElementById('div_modal_titulo').className = "modal-header text-success"
        document.getElementById('modal_conteudo').className = "modal-body text-success"
        document.getElementById('modal_botao').className = "btn btn-success"
        $('#modal_despesa').modal('show')
    }else{
        document.getElementById('modal_titulo').innerHTML = 'Registro não realizado.'
        document.getElementById('modal_conteudo').innerHTML = 'Erro! Verifique se todos os campos foram preenchidos.'
        document.getElementById('div_modal_titulo').className = "modal-header text-danger"
        document.getElementById('modal_conteudo').className = "modal-body text-danger"
        document.getElementById('modal_botao').className = "btn btn-danger"
        $('#modal_despesa').modal('show')
    }
}

function inserirDespesaTabela(despesas){
    let tabela = document.getElementById('tabela')

    despesas.forEach(v => {
        let linha = tabela.insertRow()

        linha.insertCell(0).innerHTML = `${v.dia}/${v.mes}/${v.ano}`

        switch(v.tipo){
            case '1': v.tipo='Alimentação'
                break
            case '2': v.tipo='Educação'
                break
            case '3': v.tipo='Lazer'
                break
            case '4': v.tipo='Saúde'
                break
            case '5': v.tipo='Transporte'
                break
        }
        linha.insertCell(1).innerHTML = v.tipo
        linha.insertCell(2).innerHTML = v.descricao
        linha.insertCell(3).innerHTML = v.valor

        despesas.id=localStorage.getItem('id')

        let btn = document.createElement('button')
        btn.className='btn btn-danger'
        btn.innerHTML="<i class='fas fa-times'></i>"
        btn.id=`botao${v.id}`
        btn.onclick= function(){
            let id = this.id.replace('botao','')
            window.location.reload()
            banco.remover(id)
        }
        linha.insertCell(4).append(btn)
    })
}

function gerarTodasDespesas(){
    let despesas = Array()
    despesas = banco.recuperarDespesas()

    inserirDespesaTabela(despesas)
    
}

function consultarDespesa(){
    let ano = document.getElementById('ano').value
    let mes = document.getElementById('mes').value
    let dia = document.getElementById('dia').value
    let tipo = document.getElementById('tipo').value
    let descricao = document.getElementById('descricao').value
    let valor = document.getElementById('valor').value

    let despesa = new Despesa(ano, mes, dia, tipo, descricao, valor)
    let despesasFiltradas = new Array()

    despesasFiltradas = banco.pesquisar(despesa)

    document.getElementById('tabela').innerHTML=''
    inserirDespesaTabela(despesasFiltradas)

}
