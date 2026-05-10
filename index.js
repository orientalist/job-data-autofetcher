const axios = require('axios');
const { google } = require('googleapis');
const sheets = google.sheets('v4');
const fs = require('fs');

// Read credentials and create a client once
const credentials = JSON.parse(fs.readFileSync('./api_token.json', 'utf-8'));
const line_notify_token=[
    {name:'victor',token:''}
];

const client = new google.auth.JWT(
    credentials.client_email,
    null,
    credentials.private_key,
    ['https://www.googleapis.com/auth/spreadsheets', 'https://www.googleapis.com/auth/spreadsheets.readonly']
);

exports.handler = async (event) => {
    try {
        await client.authorize();
        await main();
    } catch (e) {
        console.log(e);
    }
};

const main = async () => {
    try {
        let existed_jobNo = await fetchColumnBData();
        await insertSheet(existed_jobNo, 1);
    } catch (e) {
        console.log(e);
    }
}

const insertSheet = async (existed_jobNo, current_page) => {
    console.log(`now in page ${current_page}`);
    try {
        const response = await axios.get('', {
            params: {
                keyword: '美髮',
                isnew: '7',
                ro: '1',
                jobcat: '2006003003,2006003002,2006003009',
                kwop: '1',
                expansionType: 'area,spec,com,job,wf,wktm',
                area: '6001001000',
                order: '15',
                asc: '0',
                page: current_page,
                mode: 's',
                jobsource: '2018indexpoc',
                langFlag: '0',
                langStatus: '0',
                recommendJob: '1',
                hotJob: '1',
                excludeIndustryCat: '1003003000,1004003000',
            },
            headers: {
                Referer: ''
            }
        });

        const data = response.data.data.list;
        const totalPage = response.data.data.totalPage;

        await sendLineNotify(line_notify_token[0].token,data[0].description);

        for (j of data) {
            if (!existed_jobNo.find(n => n === j.jobNo)) {
                existed_jobNo.push(j.jobNo);
                console.log('sleeping...');
                await appendDataToSheet(j);
                await sleep(2000);  // Wait for 2 seconds
            }
        }

        if (current_page !== parseInt(totalPage)) {
            await sleep(2000);  // Wait for 2 seconds
            await insertSheet(existed_jobNo, current_page + 1);
        }
    } catch (error) {
        console.error('Error fetching data:', error);
    }
};

const fetchColumnBData = async () => {
    const range = 'Opportunity!B2:B';

    try {
        const response = await sheets.spreadsheets.values.get({
            auth: client,
            spreadsheetId: '',
            range: range
        });

        return response.data.values ? response.data.values.flat() : [];
    } catch (error) {
        console.error('Error fetching data from Google Sheet:', error);
        return [];
    }
}

const appendDataToSheet = async (job) => {
    const sheetId = '';
    const range = 'A2';

    try {
        const response = await sheets.spreadsheets.values.append({
            auth: client,
            spreadsheetId: sheetId,
            range: range,
            valueInputOption: 'RAW',
            insertDataOption: 'INSERT_ROWS',
            resource: {
                values: [
                    [
                        job.jobType,
                        job.jobNo,
                        job.jobName,
                        job.jobNameSnippet,
                        job.jobRole,
                        job.jobRo,
                        `${job.jobAddrNoDesc}-${job.jobAddress}`,
                        job.description,
                        job.optionEdu,
                        job.period,
                        job.periodDesc,
                        job.applyCnt,
                        job.applyType,
                        job.applyDesc,
                        job.custNo,
                        job.descSnippet,
                        job.custName,
                        `${job.salaryLow} ~ ${job.salaryHigh}`,
                        job.salaryDesc,
                        job.appearDate,
                        //job.tags.emp.desc,
                        job.landmark,
                        `https:${job.link.applyAnalyze}`,
                        `https:${job.link.job}`,
                        `https:${job.link.cust}`,
                        job.lon,
                        job.lat,
                        `https://www.google.com/maps?q=${job.lat},${job.lon}`
                    ]
                ]
            }
        });
    } catch (error) {
        console.error('Error appending data to Google Sheet:', error);
    }
}

const sendLineNotify=async(token,message)=> {
    const URL = 'https://notify-api.line.me/api/notify';
    const headers = {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/x-www-form-urlencoded'
    };
    const data = `message=${encodeURIComponent(message)}`;
    try {
        const response = await axios.post(URL, data, { headers: headers });
        console.log(response.data);
    } catch (error) {
        console.error('Error sending LINE notify:', error);
    }
}

// Using Promise and setTimeout to mimic sleep function
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

//main();