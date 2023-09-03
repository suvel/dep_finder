import React from 'react'

const Child1 = () => {
    return (
        <>
            <h1>Child1</h1>
            <CommonComponent >
                <CommonComponentChild1 />
            </CommonComponent>
        </>
    )
}

export default Child1