import React from 'react'
import "./Spinner.css"

export const MiniSpinner = () => {
    return (

        <div className='mini-spinner'>
            <div class="spinner-border spinner-border-sm text-muted" role="status">
                <span class="sr-only">Loading...</span>
            </div>
        </div>
    )
}

export const Spinner = () => {
    return (

        <div class="container-spinner">
            <div class="spinner-border text-primary" role="status">
                <span class="sr-only">Loading...</span>
            </div>
        </div>
    )
}

export const SmalSpinner = () => {
    return (

        <div class="container-small-spinner">
            <div class="spinner-border text-primary" role="status">
                <span class="sr-only">Loading...</span>
            </div>
        </div>
    )
}
