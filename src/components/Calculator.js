import React from 'react'
import Store from '../contexts/Store'
import Calculate from '../solver/Calculate'
import Result from '../solver/Result'

let solvers
let iterations

const states = {
    START: 'start',
    RUNNING: 'running',
    PAUSED: 'paused',
    COMPLETED: 'completed'
}

export default class Calculator extends React.Component {

    static contextType = Store

    state = {
        state: states.START,
        iterations: 0,
        result: [],
        prevResult: [],
        show: false
    }

    componentDidMount = () => {
        this.context._checkMinCore()
    }

    render = () => <Store.Consumer>
        {store => {
            const {
                skillList,
                skillData,
                targetSkillList,
                coreList,
                superposition,
                minCores,
                plusCores,
                subSkillList,
                _changeMode,
                _changeSuperposition,
                _changePlusCores,
                _changeSubSkill
            } = store

            const img = (data, pos) => data ? data[pos] : null

            const coreImg = (core) => <div key={core} className='coreImg'>
                <img src={img(skillData[skillList[core[2]]], 'img')} />
                <img src={img(skillData[skillList[core[0]]], 'core1')} />
                <img src={img(skillData[skillList[core[1]]], 'core2')} />
                <img src={require('../datas/iconFrame.frame3.png').default} />
            </div>

            const option = () => {
                if (targetSkillList.length > 0) {
                    var possible = (minCores + plusCores) * 3
                    var required = targetSkillList.length * superposition
                    if (possible - required > 0) return <div className='option'>
                        <div className='title inline'>
                            &nbsp;μ λΈ κ° ν&nbsp;
                        </div>
                        <div className='list inline'>
                            {skillList.filter((_, i) => !targetSkillList.includes(i)).map(v =>
                                <div key={v} className='item inline'>
                                    <label htmlFor={v}>
                                        <input disabled={this.state.state != states.START} type='checkbox' id={v} data-skill-id={skillList.indexOf(v)} checked={subSkillList.includes(skillList.indexOf(v))} onChange={_changeSubSkill} />
                                        {v}
                                    </label>
                                </div>)}
                        </div>
                    </div>
                }
            }

            const status = () => {
                switch (this.state.state) {
                    case states.START:
                        return <div className='status'>
                            <input type='button' id='home' onClick={_changeMode} />
                            <label htmlFor='home'>λ μ κ° κΈ°</label>
                            <input type='button' id='calc' onClick={this._calcButton} />
                            <label htmlFor='calc'>κ³ μ° μ μ</label>
                        </div>
                    case states.RUNNING:
                        return <div className='status'>
                            <p className='title'>STATUS : κ³ μ° μ€</p>
                            <p><span className='target'>{this.state.iterations}</span> λ²μ νλ‘μΈμ€ μ€ν</p>
                            <p><span className='target'>{this.state.result.length + this.state.prevResult.length}</span> κ°μ μ‘°ν© μ°Ύμλ
                                <input type='button' id='show' disabled={!(this.state.result.length + this.state.prevResult.length)} onClick={() => this._toggleShow()}/>
                                <label htmlFor='show' className='target'>κ²° κ³Ό λ³΄ κΈ°</label></p>
                            <input type='button' id='calc' className='moveRight' onClick={this._calcButton} />
                            <label htmlFor='calc'>μΌ μ μ  μ§</label>
                        </div>

                    case states.PAUSED:
                        return <div className='status'>
                            <p className='title'>STATUS : μΌ μ μ  μ§</p>
                            <p className='target'>β»κ²°κ³Όκ° μΌμ  λ¨μλ₯Ό λμμ μλ μΌμμ μ§ λ©λλ€.β»</p>
                            <p><span className='target'>{this.state.iterations}</span> λ²μ νλ‘μΈμ€ μ€ν</p>
                            <p><span className='target'>{this.state.result.length + this.state.prevResult.length}</span> κ°μ μ‘°ν© μ°Ύμλ
                                <input type='button' id='show' disabled={!(this.state.result.length + this.state.prevResult.length)} onClick={() => this._toggleShow()}/>
                                <label htmlFor='show' className='target'>κ²° κ³Ό λ³΄ κΈ°</label></p>
                            <input type='button' id='reset' onClick={this._reset} />
                            <label htmlFor='reset'>λ¦¬ μ</label>
                            <input type='button' id='calc' onClick={this._calcButton} />
                            <label htmlFor='calc'>κ³ μ μ€ ν</label>
                        </div>

                    case states.COMPLETED:
                        return <div className='status'>
                            <p className='title'>STATUS : κ³ μ° μ λ£</p>
                            <p><span className='target'>{this.state.iterations}</span> λ²μ νλ‘μΈμ€ μ€ν</p>
                            <p><span className='target'>{this.state.result.length + this.state.prevResult.length}</span> κ°μ μ‘°ν© μ°Ύμλ
                                <input type='button' id='show' disabled={!(this.state.result.length + this.state.prevResult.length)} onClick={() => this._toggleShow()}/>
                                <label htmlFor='show' className='target'>κ²° κ³Ό λ³΄ κΈ°</label></p>
                            <input type='button' id='calc' className='moveRight' onClick={this._calcButton} />
                            <label htmlFor='calc'>λ¦¬ μ</label>
                        </div>
                }
            }

            if(this.state.show){
                return <Result result={this.state.result} prevResult={this.state.prevResult} toggle={this._toggleShow}/>
            } else {
                return <div id='Calculator'>
                    <div className='coreList'>
                        <p className='title'>Core List</p>
                        <div className='list'>
                            {coreList.map(v => coreImg(v))}
                        </div>
                    </div>
                    <div className='targetList'>
                        <p className='title'>Target List</p>
                        <div className='list'>
                            {targetSkillList.map(v => <img key={v} src={img(skillData[skillList[v]], 'img')} />)}
                        </div>
                    </div>
                    <div className='setting'>
                        <p>
                            <span className='target'>Core List</span> λ₯Ό&nbsp;
                            <span className='target'>Target List</span> λ€μ΄
                        </p>
                        <input disabled={this.state.state != states.START} type='button' id='superposition' onClick={_changeSuperposition} />
                        <label htmlFor='superposition'>&nbsp;{superposition}&nbsp;μ€ μ²©&nbsp;</label>
                        <input disabled={this.state.state != states.START} type='button' id='cores' onClick={_changePlusCores} />
                        <label htmlFor='cores'>
                            &nbsp;{minCores + plusCores}
                            &nbsp;( μ΅ μ
                            {plusCores == 0 ? null : ` + ${plusCores}`}
                            &nbsp;) μ½ μ΄&nbsp;</label>
                        <p className='inline'>
                            &nbsp;κ° λλλ‘ κ³μ°ν©λλ€.
                        </p>
                    </div>
                    {option()}
                    {status()}
                </div>                
            }
        }}
    </Store.Consumer>

    _toggleShow = () => {
        const { state } = this.state
        if(state == states.RUNNING){
            document.querySelector('input#calc').click()
        }
        this.setState(prevState => {
            let show = !prevState.show
            return {
                ...prevState,
                show
            }
        })
    }

    _getResult = (combed,list) => {
        const { skillList, coreList } = this.context
        let sortedCoreList = new Array(skillList.length).fill().map(v => v = new Array(0))
        for(let core of coreList){
            let group = core[0]
            sortedCoreList[group][sortedCoreList[group].length] = [core[1],core[2]]
        }

        let correctList = [[]]
        for(let index=0;index<combed.length;index++){
            let main = combed[index]
            let sub = list[index]
            let temp = []
            for(let core of sortedCoreList[main]){
                if(core[0] == sub[0] && core[1] == sub[1]){
                    for(let prev of correctList){
                        temp[temp.length] = [...prev,[main,sub[0],sub[1]]]
                    }
                }                
                if(core[0] == sub[1] && core[1] == sub[0]){
                    for(let prev of correctList){
                        temp[temp.length] = [...prev,[main,sub[1],sub[0]]]
                    }
                }
            }
            correctList = temp
        }

        this.setState(prevState => {
            let result = [...prevState.result,...correctList]
            result = result.sort((a,b) => {
                return a.map(v => v.join('')).join('') - b.map(v => v.join('')).join('')
            })
            let {state,prevResult} = prevState
            if(result.length >= 1000){
                for(let solver of solvers){
                    solver.pause()
                }
                state = states.PAUSED
                prevResult = [...prevResult,...result]
                result = []
            }
            let iterations = prevState.iterations
            for (let solver of solvers) {
                iterations += solver.iterations
                solver.iterations = 0
            }
            return{
                ...prevState,
                state,
                iterations,
                result,
                prevResult
            }
        })
    }

    _calcButton = async () => {
        switch (this.state.state) {
            case states.START:
                iterations = setInterval(this._cntIterations, 333)
                this.setState({ state: states.RUNNING })
                document.querySelector('input#closeVmatrix').toggleAttribute('disabled')
                await this._runCalculate()
                solvers = []
                this.setState({ state: states.COMPLETED })
                break

            case states.RUNNING:
                clearInterval(iterations)
                let sum = 0
                for (let solver of solvers) {
                    solver.pause()
                    sum += solver.iterations
                    solver.iterations = 0
                }
                this.setState({
                    state: states.PAUSED,
                    iterations: this.state.iterations + sum
                })
                break

            case states.PAUSED:
                iterations = setInterval(this._cntIterations, 333)
                for (let solver of solvers) {
                    solver.continue()
                }
                this.setState({ state: states.RUNNING })
                break

            case states.COMPLETED:
                this._reset()
                break
        }
    }

    _cntIterations = () => {
        let sum = 0
        for (let solver of solvers) {
            sum += solver.iterations
            solver.iterations = 0
        }
        this.setState({ iterations: this.state.iterations + sum })
    }

    _reset = () => {
        solvers = []
        this.setState({
            state: states.START,
            iterations: 0,
            result: []
        })
        document.querySelector('input#closeVmatrix').toggleAttribute('disabled')
    }

    _runCalculate = async () => {
        const {
            skillList,
            targetSkillList,
            coreList,
            subSkillList,
            superposition,
            minCores,
            plusCores
        } = this.context

        let combedList = []
        const comb = (result, index, n, r, target) => {
            if (r == 0) combedList[combedList.length] = result
            else if (target == n) return
            else {
                result[index] = target
                comb([...result], index + 1, n, r - 1, target + 1)
                comb([...result], index, n, r, target + 1)
            }
        }
        comb([], 0, skillList.length, minCores + plusCores, 0)

        let sortedCoreList = new Array(skillList.length).fill().map(v => v = new Array(0))
        for (let core of coreList) {
            let group = core[0]
            sortedCoreList[group][sortedCoreList[group].length] = [core[1], core[2]]
        }

        solvers = []
        for (let combed of combedList) {
            solvers[solvers.length] = new Calculate(combed, skillList, targetSkillList, sortedCoreList, subSkillList, superposition, minCores, plusCores, this._getResult)
        }

        let solving = []
        for (let solver of solvers) {
            solving[solving.length] = solver.solve()
        }

        await Promise.all(solving)
        clearInterval(iterations)
        this._cntIterations()
    }
}