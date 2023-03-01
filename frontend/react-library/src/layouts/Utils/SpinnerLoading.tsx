export const SpinnerLoading = () => {
    return (
        <div className='container pt-auto  d-flex justify-content-center'
            style={{ height: 550 }}>
            <div className='spinner-border text-primary' role='status'>
                <span className='visually-hidden'>Loading...</span>
            </div>
        </div>
    )
}