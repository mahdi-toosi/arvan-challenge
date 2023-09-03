import type { ValidationRuleWithParams } from '@vuelidate/core'
import { helpers, required } from '@vuelidate/validators'

export default function useValidation() {
	const requiredField = helpers.withMessage('Required field', required)

	const validators = {
		requiredField: { requiredField },
	}

	return validators
}

export type ValidationCustomRules = Record<
	string,
	{ [key: string]: ValidationRuleWithParams<object> }
>
