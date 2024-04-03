//import axios from 'axios';

import { newVacancy } from '../../reducers/hhReduser';

const getData = async (url) => {
    try {
        const response = await fetch(url);
        const data = await response.text();
        return data;
        // console.log(data);
    } catch (e) {
        console.log('Data not loading!');
    }
};

const parseVacancy = async (vacancyId) => {
    const url = `https://krasnoyarsk.hh.ru/vacancy/${vacancyId}`;
    const reg = /"keySkill":.?[^}]+/;
    const regTitle =
        /name="description" content="Вакансия(?<title>.+?(занятость.))/;
    let goodVacancy = false;
    try {
        const data = await getData(url);
        const skillsArray =
            data.match(reg)?.[0].replace('"keySkill":', '') || [];
        //console.log(skillsArray);
        const title = data.match(regTitle).groups.title;
        //console.log(title);
        if (
            skillsArray.includes('JavaScript') ||
            skillsArray.includes('Node.js')
        )
            goodVacancy = true;
        return [goodVacancy, vacancyId, title, skillsArray];
    } catch (e) {
        return undefined;
    }
};

export const getListVacancies = (page = 0) => {
    return async (dispatch) => {
        const reg = /"userLabelsForVacancies":{.+?}/;
        const data = await getData(
            `https://krasnoyarsk.hh.ru/vacancy?search_field=name&search_field=company_name&search_field=description&enable_snippets=false&schedule=remote&professional_role=156&professional_role=160&professional_role=10&professional_role=12&professional_role=150&professional_role=25&professional_role=165&professional_role=34&professional_role=36&professional_role=73&professional_role=155&professional_role=96&professional_role=164&professional_role=104&professional_role=157&professional_role=107&professional_role=112&professional_role=113&professional_role=148&professional_role=114&professional_role=116&professional_role=121&professional_role=124&professional_role=125&professional_role=126&page=${page}`
        );
        //console.log(data);
        const result = data
            .match(reg)[0]
            .replace('"userLabelsForVacancies":', '');

        const arrayOfVacancies = Object.keys(JSON.parse(result));
        console.log(arrayOfVacancies);

        for (let id of arrayOfVacancies) {
            const vacancyInfo = await parseVacancy(id);
            if (vacancyInfo) {
                dispatch(newVacancy(vacancyInfo));
                console.log('NEW VACANCY');
                //console.log(vacancyInfo);
            } else console.log(`Vacancy ${id} not parsed`);
        }
    };
};
