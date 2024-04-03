import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

function createItem(array, page) {
    return array.map((el, index) => ({
        number: index + page * 20,
        flag: false,
        id: el,
        text: '',
        skills: null,
        error: false,
        load: false,
    }));
}

export const fetchVacancyIds = createAsyncThunk(
    'hhReducer/fetchVacancies',
    async function (page) {
        const reg = /"userLabelsForVacancies":{.+?}/;
        const response = await fetch(
            `https://krasnoyarsk.hh.ru/vacancy?search_field=name&search_field=company_name&search_field=description&enable_snippets=false&schedule=remote&professional_role=156&professional_role=160&professional_role=10&professional_role=12&professional_role=150&professional_role=25&professional_role=165&professional_role=34&professional_role=36&professional_role=73&professional_role=155&professional_role=96&professional_role=164&professional_role=104&professional_role=157&professional_role=107&professional_role=112&professional_role=113&professional_role=148&professional_role=114&professional_role=116&professional_role=121&professional_role=124&professional_role=125&professional_role=126&page=${page}`
        );
        const data = await response.text();
        //console.log(data);
        const result = data
            .match(reg)[0]
            .replace('"userLabelsForVacancies":', '');

        const arrayOfVacancies = createItem(
            Object.keys(JSON.parse(result)),
            page
        );
        console.log(arrayOfVacancies);
        return arrayOfVacancies;
    }
);

export const parseVacancy = createAsyncThunk(
    'hhReducer/parseVacancy',
    async function (vacancy) {
        const url = `https://krasnoyarsk.hh.ru/vacancy/${vacancy.id}`;
        const reg = /"keySkill":.?[^}]+/;
        const regTitle =
            /name="description" content="Вакансия(?<title>.+?(занятость.))/;
        let goodVacancy = false;
        try {
            const response = await fetch(url);
            const data = await response.text();

            const skills =
                data
                    .match(reg)?.[0]
                    .replace('"keySkill":', '')
                    .match(/(\w+)/g) || [];
            // console.log(skills);
            const text = data.match(regTitle).groups.title;
            //console.log(text);
            if (skills.includes('JavaScript') || skills.includes('Node.js'))
                goodVacancy = true;
            return {
                ...vacancy,
                flag: goodVacancy,
                text: text,
                skills: skills,
                load: true,
            };
        } catch (e) {
            return {
                ...vacancy,
                error: true,
            };
        }
    }
);

const hhSlice = createSlice({
    name: 'hhReducer',
    initialState: {
        vacancies: [],
        status: null,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(fetchVacancyIds.pending, (state) => {
            state.status = 'loading';
            state.error = null;
        });
        builder.addCase(fetchVacancyIds.fulfilled, (state, action) => {
            state.vacancies = [...state.vacancies, ...action.payload];
            console.log('PAYLOAD IN REDUCER', state.vacancies);
            state.status = 'resolved';
        });
        builder.addCase(fetchVacancyIds.rejected, (state, action) => {
            state.status = 'error';
        });
        builder.addCase(parseVacancy.pending, (state) => {});
        builder.addCase(parseVacancy.fulfilled, (state, action) => {
            console.log('IN REDUCER', action.payload);
            const number = action.payload.number;
            state.vacancies.splice(number, 1, action.payload);
        });
        builder.addCase(parseVacancy.rejected, (state, action) => {});
    },
});

export const { newVacancy } = hhSlice.actions;
export default hhSlice.reducer;
