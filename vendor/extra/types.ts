export interface ProviderEntry {
	id: string;
	name: string;
	label: string;
	npm: string;
	api: string;
	env: string[];
}

export interface ModelModality {
	input: string[];
	output: string[];
}

export interface ModelLimit {
	context: number;
	output: number;
}

export interface ModelEntry {
	id: string;
	name: string;
	family: string;
	attachment: boolean;
	reasoning: boolean;
	tool_call: boolean;
	temperature: boolean;
	modalities: ModelModality;
	limit: ModelLimit;
	streaming?: boolean;
	structured_output?: boolean;
	knowledge?: string;
	release_date?: string;
	last_updated?: string;
	open_weights?: boolean;
	cost?: {
		input: number;
		output: number;
	};
}

export interface ExtraProviderFile {
	provider: ProviderEntry;
	models: Record<string, ModelEntry>;
}
