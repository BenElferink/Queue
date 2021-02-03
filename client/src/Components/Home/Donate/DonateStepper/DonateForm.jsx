import React from 'react'
import { Fragment } from 'react'
import Iframe from 'react-iframe'


function DonateForm() {
    return (
        <Fragment>
            <Iframe allowpaymentrequest="" frameborder="0" height="900px" name="donorbox" scrolling="no" seamless="seamless" src="https://donorbox.org/embed/queue?default_interval=o&hide_donation_meter=true" style="min-width: 250px; max-height:none!important"/>
        </Fragment>
    )
}

export default DonateForm
