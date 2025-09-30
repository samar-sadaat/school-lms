import 'primeicons/primeicons.css';

function Pagenation() {
    return (
        <>
            <div className="btnNavigation">
                <button type="button" className='pageNavigate'><i className="pi pi-angle-double-left" style={{ fontSize: '1.2rem' }}></i></button>
                <button type="button" className='pageNavigate'><i className="pi pi-angle-double-right" style={{ fontSize: '1.2rem' }}></i></button>
            </div>
        </>
    )
}

export default Pagenation;