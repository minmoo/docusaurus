import React from 'react'

export const Aside = ({children}) => {
    return(
        <div className="alert alert--success" role="alert">
            {children}
        </div>
    )
}