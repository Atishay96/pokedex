import React, { Component } from 'react';
import pokemonsData from './static/pd.json';
// import ContentLoader from 'react-content-loader'
import './css/lp.css';

class landingPage extends Component {
    constructor(){
        super();
        pokemonsData.map( (v, i) => {
            return pokemonsData[i].index = i;
        })
        this.state = {
            pokemons: pokemonsData,
            selected: {
                abilities:[],
                detailPageURL: '',
                weight: '',
                weakness: [],
                number: '',
                height: '',
                collectibles_slug: '',
                featured: '',
                slug: '',
                name: '',
                ThumbnailAltText: '',
                ThumbnailImage: '',
                id: '',
                type: [],
                index: 0
            },
            searchedText: '',
            searched: [],
            loaded: false,
            game: false,
            hideAnswer : true,
            winningStatus: ''
        }
        this.handleImageLoaded = this.handleImageLoaded.bind(this);
        this.image = React.createRef();
    }
    //{"abilities":["Overgrow"],"detailPageURL":"/us/pokedex/bulbasaur","weight":15.2,"weakness":["Fire","Flying","Ice","Psychic"],"number":"001","height":28.0,"collectibles_slug":"bulbasaur","featured":"true","slug":"bulbasaur","name":"Bulbasaur","ThumbnailAltText":"Bulbasaur","ThumbnailImage":"https://assets.pokemon.com/assets/cms2/img/pokedex/detail/001.png","id":1,"type":["grass","poison"]}
    componentDidMount() {
        const { pokemons, selected } = this.state;
        if( selected.id ){
            return;
        }
        this.setState({ selected: pokemons[0] });
        const img = this.image.current;
        if (img && img.complete) {
            this.handleImageLoaded();
        }
    }
    changePokemon(state) {
        const { selected, pokemons, game } = this.state;
        if( game ){
            return;
        }
        this.setState({ loaded: false });
        let index = selected.index;
        if( state === 'prev' ){
            index--;
        } else {
            index++;
        }
        if(index < 0) {
            index = pokemons.length - 1;
        }
        if(index >= pokemons.length){
            index = 0;
        }
        pokemons[index].index = index;
        this.setState({ selected: pokemons[index], searchedText: '' });
    }
    searchPokemon(text) {        
        if(text.length <! 2) {
            return;
        }
        this.setState({searchedText: text});
        const { pokemons, game } = this.state;
        if( game ){
            return;
        }
        let searched = pokemons.filter( (v) => { if (v.name.toLowerCase().includes(text.toLowerCase()) ) { return true; } else { return false;} })
        this.setState({ searched : searched });
    }
    changePokemonSearch(element) {
        var id = element.id;
        this.setState({ loaded: false });

        const { pokemons } = this.state;
        if(id < 0 || id >= pokemons.length){
            id = 0;
        }
        this.setState({ searchedText : '', selected: pokemons[id] });
    }
    similarity(s1, s2) {
        var longer = s1;
        var shorter = s2;
        if (s1.length < s2.length) {
            longer = s2;
            shorter = s1;
        }
        var longerLength = longer.length;
        if (longerLength === 0) {
            return 1.0;
        }
        return (longerLength - this.editDistance(longer, shorter)) / parseFloat(longerLength);
    }
    editDistance(s1, s2) {
        s1 = s1.toLowerCase();
        s2 = s2.toLowerCase();
        
        var costs = [];
        for (var i = 0; i <= s1.length; i++) {
            var lastValue = i;
            for (var j = 0; j <= s2.length; j++) {
            if (i === 0)
                costs[j] = j;
            else {
                if (j > 0) {
                var newValue = costs[j - 1];
                if (s1.charAt(i - 1) !== s2.charAt(j - 1))
                    newValue = Math.min(Math.min(newValue, lastValue),
                    costs[j]) + 1;
                costs[j - 1] = lastValue;
                lastValue = newValue;
                }
            }
            }
            if (i > 0)
            costs[s2.length] = lastValue;
        }
        return costs[s2.length];
    }
    handleImageLoaded() {
        if (!this.state.loaded) {
            // console.log('image loaded');
            this.setState({ loaded: true });
        }
    }
    async playGame(element, input) {
        if( input ){
            input.value = '';
            this.setState({searchedText: ''});
        }
        if(element) {
            if( this.state.game ) {
                await this.setState({ x: '' })
                element.classList.remove("gameImage");
            } else {
                const { pokemons } = this.state;
                let random = this.getRandomInt(0, pokemons.length);
                this.setState({ selected: pokemons[random], hideAnswer: true })
                element.classList.add("gameImage");
            }
            this.setState({ game : !this.state.game, winningStatus: '' });
        }
    }
    getRandomInt(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }
    checkAnswer(element) {
        const { selected, searchedText } = this.state;
        let percentage = this.similarity(selected.name.toLowerCase(), searchedText);
        let winningStatus;
        if(percentage > 0.83) {
            winningStatus = 'wow! you got the right answer.';
        } else {
            winningStatus = 'Oops! You got it wrong this time.';
        }
        this.setState({ hideAnswer: false, winningStatus });
        element.classList.remove("gameImage");
    }
    async setGame(element, input) {
        if( input ){
            input.value = '';
            this.setState({searchedText: ''});
        }
        await this.setState({ game: false });
        this.playGame(element);
    }
    render() {
        const { searchedText, selected, searched, game, hideAnswer, winningStatus } = this.state;
        return (
        <div id="pokedex">
            <div className="sensor">
                <button></button>
            </div>
            <div className="camera-display">
                {/* <span hidden = { !loaded }> */}
                    <img id="image" src={selected.ThumbnailImage} ref={this.image} onLoad = {this.handleImageLoaded}  alt={selected.ThumbnailAltText}/>
                {/* </span> */}
                {/* <span hidden = { loaded }>
                    <img id="image" src='' ref={ this.image } onLoad = {this.handleImageLoaded}  alt={'Loading Image...'}/>
                </span> */}
            </div>
            <div className="divider"></div>
            <div className="stats-display">
                <span hidden = { !game }>
                    <button onClick = { () => this.playGame( document.getElementById('image'), document.getElementById('input-pokemon') ) } className="bottom-modes rightSide">Exit</button>
                    <h2>Game Started. Guess the pokemon</h2>
                    <h2>Your Answer: {searchedText}</h2>
                    <br/>
                    <span hidden = { !searchedText.length || !hideAnswer}>
                        <button onClick = { () => this.checkAnswer( document.getElementById('image') ) } className="bottom-modes">Check</button>
                    </span>
                    <span hidden = { hideAnswer }>
                        <button onClick = { () => this.setGame( document.getElementById('image'), document.getElementById('input-pokemon') ) } className="bottom-modes">Play again</button>
                    </span>
                    <div hidden = { !winningStatus.length }>
                        <h2>
                            { winningStatus }
                        </h2>
                    </div>
                </span>
                <span hidden = { ( searchedText.length > 2 && !game ) || (game && hideAnswer)}>
                    <h2>{selected.name}</h2>
                    <h3>Number</h3>
                    <div>{selected.number}</div>
                    <h3>Weight</h3>
                    <div>{selected.weight}</div>
                    <h3>Height</h3>
                    <div>{selected.height}</div>
                    <h3>Abilities</h3>
                    <ul>
                        { selected.abilities.map((ability, index) => <li key={ index }> { ability } </li>)}
                    </ul>
                    <h3>Type</h3>
                    <ul>
                    { selected.type.map((type, index) => <li key={ index }> {type} </li>)}
                    </ul>
                    <h3>Weakness</h3>
                    <ul>
                    { selected.weakness.map((weakness, index) => <li key={ index }> {weakness} </li>)}
                    </ul>
                </span>
                <span  hidden = {searchedText.length < 3  || game }>
                    <h2 hidden = { !searched.length }>Pokemon found:</h2>
                    <h2 hidden = { searched.length }>No Pokemon Found</h2>
                    <ul>
                       { searched.map(pokemon => <li  className = "cursor" id = { pokemon.index } onClick = { (e) => this.changePokemonSearch(e.target) }> { pokemon.name } </li>)}                        
                    </ul>
                </span>                
            </div>
            <div className="botom-actions">
                <div id="actions">
                    <button onClick= { () => this.playGame(document.getElementById('image'), document.getElementById('input-pokemon')) } className="a"></button>
                </div>
                <div id="cross">
                    <button onClick= { () => this.changePokemon('prev') } className="cross-button up"></button>
                    <button onClick= { () => this.changePokemon('prev') } className="cross-button right"></button>
                    <button onClick= { () => this.changePokemon('next') } className="cross-button down"></button>
                    <button onClick= { () => this.changePokemon('next') } className="cross-button left"></button>
                    <div className="cross-button center"> </div>
                </div>
            </div>
            <div onChange = { (e) => this.searchPokemon(e.target.value) } className="input-pad"><input id="input-pokemon" placeholder = "Enter Pokemon Name" /></div>
            {/* <div className="bottom-modes">
                <button className="level-button"></button>
                <button className="level-button"></button>
                <button className="level-button"></button>
                <button className="level-button"></button>
                <button className="pokedex-mode black-button">Pokedex</button>
                <button className="game-mode black-button">Game</button>
            </div> */}
        </div>
        )
    }
}

export default landingPage;