import styles from './style.css'
import ScriptField from '../script-field'
import Card from '@/ui/card'
import { camelToWords } from '../../common/util'

export default {
    functional: true,
    render(h, { props: { script: { name, fields } }, listeners }) {
        return <Card class={styles.scriptCard}>
            <div class={styles.title}>{camelToWords(name)}</div>
            {fields && Object.keys(fields).map(fieldName => {
                const field = { name: fieldName, ...fields[fieldName] }
                return <div>
                    <ScriptField field={field}
                                 onInput={val => listeners.input({ scriptName: name, ...val })}/>
                </div>
            })}
        </Card>
    }
}
