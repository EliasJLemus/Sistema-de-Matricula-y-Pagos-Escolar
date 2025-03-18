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
         sx={
            {
                backgroundColor: "#F5F1E3",
                width: '100%',
                height: '40px',
                borderRadius: '0px',
                textTransform: 'none',
                justifyContent: 'flex-start',
                paddingLeft: '20px',
                color: 'white',
                '&:hover': {
                    backgroundColor: 'rgba(255, 255, 255, 0.2)'
                }
            }
         }
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