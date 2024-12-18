import useNumberInput from "@hooks/use-number-input";
import { Input } from "antd";

const NumberInput=({onChange,...rest}:any)=>{

    const inputProps=useNumberInput({
        initialValue:"-20000.232",
        decimalPlaces:18,
        allowZero:false,
       onChange
    });

    return <Input {...rest} {...inputProps}/>
}


export default NumberInput;