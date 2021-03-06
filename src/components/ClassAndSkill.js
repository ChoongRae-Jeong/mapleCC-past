import React from 'react'
import Store from '../contexts/Store'
import Class from './Class'
import Skill from './Skill'

export default () => <Store.Consumer>
    {store => <div id='ClassAndSkill'>
        <div className='position'>
            <input type='radio' name='page' id='class' onChange={store._changePage} checked={store.page === 'class'} />
            <label htmlFor='class' className='page'>직 업</label>
            <input type='radio' name='page' id='skill' onChange={store._changePage} checked={store.page === 'skill'} />
            <label htmlFor='skill' className='page'>스 킬</label>
        </div>
        {store.page == 'class' ? <Class /> : <Skill />}
    </div>}
</Store.Consumer>