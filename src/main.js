import api from './api' ;

class App {
    // this class is responsable for all
    constructor(){
        this.reply = '';
        this.TAXA_JUROS = 0.00517;

        this.formEl = document.getElementById('simulate-form');
        this.inputNomeEl = document.querySelector('input[name=nome]'); 
        this.inputMensalidadeEl = document.querySelector('input[name=mensalidade]'); 
        this.inputTempoEl = document.querySelector('input[name=tempo]'); 
        this.replyEl = document.getElementById('form-reply');

        this.registerHandlers();
    }

    registerHandlers() {
        //registra os eventos 
        this.formEl.onsubmit = event => this.simulate(event);
    }

    setLoading(loading = true){
        // if(loading === true){
        //     let loadingEl = document.createElement('span');
        //     loadingEl.appendChild(document.createTextNode('Carregando...'));
        //     loadingEl.setAttribute('id', 'loading');

        //     this.formEl.appendChild(loadingEl);
        // } else {
        //     document.getElementById('loading').remove();
        // }
    }

    async simulate(event){
        event.preventDefault();

        const nome = this.inputNomeEl.value;
        const valorMensalidade = this.inputMensalidadeEl.value;
        const tempoDeContribuicao = this.inputTempoEl.value;

        if(valorMensalidade.length === 0 && tempoDeContribuicao.length === 0)
            return;

        const tmpContribuicao = parseInt(tempoDeContribuicao)*24;
        const expr = `${valorMensalidade} * (((1 + ${this.TAXA_JUROS}) ^ ${tmpContribuicao} - 1) / ${this.TAXA_JUROS})`;
        
        this.setLoading(); 

        try{
            const response = await api.post('',{
                expr, 
                precision: 6}
            );

           console.log(response);
           const {result,error} = response.data;

        //    this.inputNomeEl.value = '';
        //    this.inputMensalidadeEl.value = '';
        //    this.inputTempoEl.value = '';
           this.reply = `Olá ${nome}, juntando R$${valorMensalidade} todo mês, você terá R$${result} em ${tmpContribuicao} meses.`;
           this.render();
        } catch (err) {
            alert(err);
        } finally {
            this.setLoading(false);
        }
    }
    
    render(){
        this.replyEl.innerHTML = '';
        this.replyEl.appendChild(document.createTextNode(this.reply));
    }
}

new App();