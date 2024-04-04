import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

export const parseVacancy = createAsyncThunk(
    'hhReducer/parseVacancy',
    async (vacancy) => {
        console.log('IN ACTION', vacancy);
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
    reducers: {
        changeStatus(state, action) {
            console.log('CHANGE STATUS', action.payload);
            state.status = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder.addCase(parseVacancy.pending, (state, action) => {
            state.status = 'pending';
        });
        builder.addCase(parseVacancy.fulfilled, (state, action) => {
            console.log('IN REDUCER', action.payload);
            state.vacancies.push(action.payload);
            state.status = 'resolved';
        });
        builder.addCase(parseVacancy.rejected, (state, action) => {
            state.status = 'error';
            console.log('VACANCY NOT PARSED!');
        });
    },
});

export const { changeStatus } = hhSlice.actions;
export default hhSlice.reducer;
