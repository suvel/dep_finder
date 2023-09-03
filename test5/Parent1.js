import React from 'react'
import Child1 from './Child1'

const Parent1 = () => {
    return (<>
        <h1>Parent</h1>
        <Child1 />
        <Child2>
            <SubChild1>
                <SubGrandChild1 />
            </SubChild1>
            <SubChild2 />
        </Child2>
        <CommonComponent />
    </>)
}

export default Parent1