import useNumberInput from "@hooks/use-number-input";
import { Input } from "antd";

const NumberInput=({onChange,...rest}:any)=>{

    const inputProps=useNumberInput({
        initialValue:"-20000.23266666",
        decimalPlaces:3,
        onChange,
    });

    return <Input {...rest} {...inputProps}/>
}


export default NumberInput;