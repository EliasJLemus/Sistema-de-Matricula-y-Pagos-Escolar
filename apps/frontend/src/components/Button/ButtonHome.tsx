import {Button, ButtonProps} from "@mui/material"

interface ButtonHomeProps extends ButtonProps {
    img: string;
    imgAlt?: string;
    text: string;
}

const ButtonHome: React.FC<ButtonHomeProps> = ({
    img,
    imgAlt= 'icon',
    text,
    ...props
}) => {
    return (
        <Button 
        {...props}
        startIcon = {
            <img src={img} alt={imgAlt} />
        }
        >
            {text}
        </Button>
    )
}

export default ButtonHome;