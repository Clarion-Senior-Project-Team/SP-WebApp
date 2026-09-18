

const Button = (props) => {

    const handleClick = () => {
        props.onClick?.();
    }

    return (
        <button className={props.buttonType ?? "normal"} onClick={handleClick}>
            {props.text}
        </button>
    );
}

export default Button;
