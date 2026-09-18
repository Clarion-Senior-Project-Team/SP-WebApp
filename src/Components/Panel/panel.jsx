

const Panel = (props) => {

    return (
        <div className="panel">
            <h1 className="panelTitle">{props.title}</h1>
            { props.children }
        </div>
    );
}


export default Panel;
