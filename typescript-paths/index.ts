import 'module-alias/register';
import { addTextAtTheEnd } from "./src/components/nested-component/index";

addTextAtTheEnd('simple-text.txt', `, readed at ${new Date().getFullYear()}`)
    .then((finalText) => {
        console.log(finalText);
    })