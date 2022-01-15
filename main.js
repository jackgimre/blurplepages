const Discord = require('discord.js');
const client = new Discord.Client();
const config = require('./config.json');
const prefix = config.prefix;
const mongoose = require('mongoose');
const Profile = require('./models/profileSchema');
const lookup = require('country-code-lookup');
const countries = [
    {"name": "Afghanistan", "code": "AF"},
    {"name": "Åland Islands", "code": "AX"},
    {"name": "Albania", "code": "AL"},
    {"name": "Algeria", "code": "DZ"},
    {"name": "American Samoa", "code": "AS"},
    {"name": "Andorra", "code": "AD"},
    {"name": "Angola", "code": "AO"},
    {"name": "Anguilla", "code": "AI"},
    {"name": "Antarctica", "code": "AQ"},
    {"name": "Antigua and Barbuda", "code": "AG"},
    {"name": "Argentina", "code": "AR"},
    {"name": "Armenia", "code": "AM"},
    {"name": "Aruba", "code": "AW"},
    {"name": "Australia", "code": "AU"},
    {"name": "Austria", "code": "AT"},
    {"name": "Azerbaijan", "code": "AZ"},
    {"name": "Bahamas", "code": "BS"},
    {"name": "Bahrain", "code": "BH"},
    {"name": "Bangladesh", "code": "BD"},
    {"name": "Barbados", "code": "BB"},
    {"name": "Belarus", "code": "BY"},
    {"name": "Belgium", "code": "BE"},
    {"name": "Belize", "code": "BZ"},
    {"name": "Benin", "code": "BJ"},
    {"name": "Bermuda", "code": "BM"},
    {"name": "Bhutan", "code": "BT"},
    {"name": "Bolivia", "code": "BO"},
    {"name": "Bosnia and Herzegovina", "code": "BA"},
    {"name": "Botswana", "code": "BW"},
    {"name": "Bouvet Island", "code": "BV"},
    {"name": "Brazil", "code": "BR"},
    {"name": "British Indian Ocean Territory", "code": "IO"},
    {"name": "Brunei Darussalam", "code": "BN"},
    {"name": "Bulgaria", "code": "BG"},
    {"name": "Burkina Faso", "code": "BF"},
    {"name": "Burundi", "code": "BI"},
    {"name": "Cambodia", "code": "KH"},
    {"name": "Cameroon", "code": "CM"},
    {"name": "Canada", "code": "CA"},
    {"name": "Cape Verde", "code": "CV"},
    {"name": "Cayman Islands", "code": "KY"},
    {"name": "Central African Republic", "code": "CF"},
    {"name": "Chad", "code": "TD"},
    {"name": "Chile", "code": "CL"},
    {"name": "China", "code": "CN"},
    {"name": "Christmas Island", "code": "CX"},
    {"name": "Cocos (Keeling) Islands", "code": "CC"},
    {"name": "Colombia", "code": "CO"},
    {"name": "Comoros", "code": "KM"},
    {"name": "Congo", "code": "CG"},
    {"name": "Congo, The Democratic Republic of the", "code": "CD"},
    {"name": "Cook Islands", "code": "CK"},
    {"name": "Costa Rica", "code": "CR"},
    {"name": "Cote D'Ivoire", "code": "CI"},
    {"name": "Croatia", "code": "HR"},
    {"name": "Cuba", "code": "CU"},
    {"name": "Cyprus", "code": "CY"},
    {"name": "Czech Republic", "code": "CZ"},
    {"name": "Denmark", "code": "DK"},
    {"name": "Djibouti", "code": "DJ"},
    {"name": "Dominica", "code": "DM"},
    {"name": "Dominican Republic", "code": "DO"},
    {"name": "Ecuador", "code": "EC"},
    {"name": "Egypt", "code": "EG"},
    {"name": "El Salvador", "code": "SV"},
    {"name": "Equatorial Guinea", "code": "GQ"},
    {"name": "Eritrea", "code": "ER"},
    {"name": "Estonia", "code": "EE"},
    {"name": "Ethiopia", "code": "ET"},
    {"name": "Falkland Islands (Malvinas)", "code": "FK"},
    {"name": "Faroe Islands", "code": "FO"},
    {"name": "Fiji", "code": "FJ"},
    {"name": "Finland", "code": "FI"},
    {"name": "France", "code": "FR"},
    {"name": "French Guiana", "code": "GF"},
    {"name": "French Polynesia", "code": "PF"},
    {"name": "French Southern Territories", "code": "TF"},
    {"name": "Gabon", "code": "GA"},
    {"name": "Gambia", "code": "GM"},
    {"name": "Georgia", "code": "GE"},
    {"name": "Germany", "code": "DE"},
    {"name": "Ghana", "code": "GH"},
    {"name": "Gibraltar", "code": "GI"},
    {"name": "Greece", "code": "GR"},
    {"name": "Greenland", "code": "GL"},
    {"name": "Grenada", "code": "GD"},
    {"name": "Guadeloupe", "code": "GP"},
    {"name": "Guam", "code": "GU"},
    {"name": "Guatemala", "code": "GT"},
    {"name": "Guernsey", "code": "GG"},
    {"name": "Guinea", "code": "GN"},
    {"name": "Guinea-Bissau", "code": "GW"},
    {"name": "Guyana", "code": "GY"},
    {"name": "Haiti", "code": "HT"},
    {"name": "Heard Island and Mcdonald Islands", "code": "HM"},
    {"name": "Holy See (Vatican City State)", "code": "VA"},
    {"name": "Honduras", "code": "HN"},
    {"name": "Hong Kong", "code": "HK"},
    {"name": "Hungary", "code": "HU"},
    {"name": "Iceland", "code": "IS"},
    {"name": "India", "code": "IN"},
    {"name": "Indonesia", "code": "ID"},
    {"name": "Iran, Islamic Republic Of", "code": "IR"},
    {"name": "Iraq", "code": "IQ"},
    {"name": "Ireland", "code": "IE"},
    {"name": "Isle of Man", "code": "IM"},
    {"name": "Israel", "code": "IL"},
    {"name": "Italy", "code": "IT"},
    {"name": "Jamaica", "code": "JM"},
    {"name": "Japan", "code": "JP"},
    {"name": "Jersey", "code": "JE"},
    {"name": "Jordan", "code": "JO"},
    {"name": "Kazakhstan", "code": "KZ"},
    {"name": "Kenya", "code": "KE"},
    {"name": "Kiribati", "code": "KI"},
    {"name": "Korea, Democratic People'S Republic of", "code": "KP"},
    {"name": "Korea, Republic of", "code": "KR"},
    {"name": "Kuwait", "code": "KW"},
    {"name": "Kyrgyzstan", "code": "KG"},
    {"name": "Lao People'S Democratic Republic", "code": "LA"},
    {"name": "Latvia", "code": "LV"},
    {"name": "Lebanon", "code": "LB"},
    {"name": "Lesotho", "code": "LS"},
    {"name": "Liberia", "code": "LR"},
    {"name": "Libyan Arab Jamahiriya", "code": "LY"},
    {"name": "Liechtenstein", "code": "LI"},
    {"name": "Lithuania", "code": "LT"},
    {"name": "Luxembourg", "code": "LU"},
    {"name": "Macao", "code": "MO"},
    {"name": "Macedonia, The Former Yugoslav Republic of", "code": "MK"},
    {"name": "Madagascar", "code": "MG"},
    {"name": "Malawi", "code": "MW"},
    {"name": "Malaysia", "code": "MY"},
    {"name": "Maldives", "code": "MV"},
    {"name": "Mali", "code": "ML"},
    {"name": "Malta", "code": "MT"},
    {"name": "Marshall Islands", "code": "MH"},
    {"name": "Martinique", "code": "MQ"},
    {"name": "Mauritania", "code": "MR"},
    {"name": "Mauritius", "code": "MU"},
    {"name": "Mayotte", "code": "YT"},
    {"name": "Mexico", "code": "MX"},
    {"name": "Micronesia, Federated States of", "code": "FM"},
    {"name": "Moldova, Republic of", "code": "MD"},
    {"name": "Monaco", "code": "MC"},
    {"name": "Mongolia", "code": "MN"},
    {"name": "Montserrat", "code": "MS"},
    {"name": "Morocco", "code": "MA"},
    {"name": "Mozambique", "code": "MZ"},
    {"name": "Myanmar", "code": "MM"},
    {"name": "Namibia", "code": "NA"},
    {"name": "Nauru", "code": "NR"},
    {"name": "Nepal", "code": "NP"},
    {"name": "Netherlands", "code": "NL"},
    {"name": "Netherlands Antilles", "code": "AN"},
    {"name": "New Caledonia", "code": "NC"},
    {"name": "New Zealand", "code": "NZ"},
    {"name": "Nicaragua", "code": "NI"},
    {"name": "Niger", "code": "NE"},
    {"name": "Nigeria", "code": "NG"},
    {"name": "Niue", "code": "NU"},
    {"name": "Norfolk Island", "code": "NF"},
    {"name": "Northern Mariana Islands", "code": "MP"},
    {"name": "Norway", "code": "NO"},
    {"name": "Oman", "code": "OM"},
    {"name": "Pakistan", "code": "PK"},
    {"name": "Palau", "code": "PW"},
    {"name": "Palestinian Territory, Occupied", "code": "PS"},
    {"name": "Panama", "code": "PA"},
    {"name": "Papua New Guinea", "code": "PG"},
    {"name": "Paraguay", "code": "PY"},
    {"name": "Peru", "code": "PE"},
    {"name": "Philippines", "code": "PH"},
    {"name": "Pitcairn", "code": "PN"},
    {"name": "Poland", "code": "PL"},
    {"name": "Portugal", "code": "PT"},
    {"name": "Puerto Rico", "code": "PR"},
    {"name": "Qatar", "code": "QA"},
    {"name": "Reunion", "code": "RE"},
    {"name": "Romania", "code": "RO"},
    {"name": "Russian Federation", "code": "RU"},
    {"name": "RWANDA", "code": "RW"},
    {"name": "Saint Helena", "code": "SH"},
    {"name": "Saint Kitts and Nevis", "code": "KN"},
    {"name": "Saint Lucia", "code": "LC"},
    {"name": "Saint Pierre and Miquelon", "code": "PM"},
    {"name": "Saint Vincent and the Grenadines", "code": "VC"},
    {"name": "Samoa", "code": "WS"},
    {"name": "San Marino", "code": "SM"},
    {"name": "Sao Tome and Principe", "code": "ST"},
    {"name": "Saudi Arabia", "code": "SA"},
    {"name": "Senegal", "code": "SN"},
    {"name": "Serbia and Montenegro", "code": "CS"},
    {"name": "Seychelles", "code": "SC"},
    {"name": "Sierra Leone", "code": "SL"},
    {"name": "Singapore", "code": "SG"},
    {"name": "Slovakia", "code": "SK"},
    {"name": "Slovenia", "code": "SI"},
    {"name": "Solomon Islands", "code": "SB"},
    {"name": "Somalia", "code": "SO"},
    {"name": "South Africa", "code": "ZA"},
    {"name": "South Georgia and the South Sandwich Islands", "code": "GS"},
    {"name": "Spain", "code": "ES"},
    {"name": "Sri Lanka", "code": "LK"},
    {"name": "Sudan", "code": "SD"},
    {"name": "Suriname", "code": "SR"},
    {"name": "Svalbard and Jan Mayen", "code": "SJ"},
    {"name": "Swaziland", "code": "SZ"},
    {"name": "Sweden", "code": "SE"},
    {"name": "Switzerland", "code": "CH"},
    {"name": "Syrian Arab Republic", "code": "SY"},
    {"name": "Taiwan, Province of China", "code": "TW"},
    {"name": "Tajikistan", "code": "TJ"},
    {"name": "Tanzania, United Republic of", "code": "TZ"},
    {"name": "Thailand", "code": "TH"},
    {"name": "Timor-Leste", "code": "TL"},
    {"name": "Togo", "code": "TG"},
    {"name": "Tokelau", "code": "TK"},
    {"name": "Tonga", "code": "TO"},
    {"name": "Trinidad and Tobago", "code": "TT"},
    {"name": "Tunisia", "code": "TN"},
    {"name": "Turkey", "code": "TR"},
    {"name": "Turkmenistan", "code": "TM"},
    {"name": "Turks and Caicos Islands", "code": "TC"},
    {"name": "Tuvalu", "code": "TV"},
    {"name": "Uganda", "code": "UG"},
    {"name": "Ukraine", "code": "UA"},
    {"name": "United Arab Emirates", "code": "AE"},
    {"name": "United Kingdom", "code": "GB"},
    {"name": "United States", "code": "US"},
    {"name": "United States Minor Outlying Islands", "code": "UM"},
    {"name": "Uruguay", "code": "UY"},
    {"name": "Uzbekistan", "code": "UZ"},
    {"name": "Vanuatu", "code": "VU"},
    {"name": "Venezuela", "code": "VE"},
    {"name": "Viet Nam", "code": "VN"},
    {"name": "Virgin Islands, British", "code": "VG"},
    {"name": "Virgin Islands, U.S.", "code": "VI"},
    {"name": "Wallis and Futuna", "code": "WF"},
    {"name": "Western Sahara", "code": "EH"},
    {"name": "Yemen", "code": "YE"},
    {"name": "Zambia", "code": "ZM"},
    {"name": "Zimbabwe", "code": "ZW"}
]

function getRandomInt(max) {
    return Math.floor(Math.random()*max);
}

async function searchProfiles(message) {
    let sender = await Profile.findOne({id: message.author.id});
    let results = await Profile.find();

    let query = {
        qCountry: sender.qCountry,
        qAge: sender.qAge
    }
    console.log(query);
    var i = 0;
    while(i<results.length) {
        let profile = await client.users.fetch(results[i].id).catch(console.error);
        let req = await Profile.findOne({id: profile.id});

        if(query.qAge[0] <= req.age && query.qAge[1] >= req.age) {
            for(j=0;j<query.qCountry.length;j++) {
                if(req.country == query.qCountry[j]) {
                    console.log(`${profile.username} fits your query!`)

                    //send found match message
                    profile.send(`**${message.author.username}#${message.author.discriminator}** matched to your BlurplePages account on **${message.guild.name}**`);
                    var embed = new Discord.MessageEmbed()
                        .setTitle(`${profile.username}#${profile.discriminator}`)
                        .setDescription(`Send a message to ${profile.username}, they fit your search query!`)
                        .addField('Age',req.age,true)
                        .addField('Country',`${req.country} :flag_${lookup.byCountry(req.country).iso2.toLowerCase()}:`,true)
                        .setThumbnail(profile.displayAvatarURL())
                        .setFooter(message.author.username, message.author.displayAvatarURL());
                    message.channel.send(embed);
                    return;
                }
            }
            console.log('Not a query match. Onto next profile!');
            i++;
        } else {
            console.log('Not in age range!');
            i++;
        }
    }
    console.log('There are no matches :(');
}

client.once('ready', () => {
    console.log('BlurplePages is online!');
    mongoose.connect(config.mongodb_srv,{
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false
    }).then(()=>{
        console.log('Connected to MongoDB Database.');
    }).catch((err)=>{
        console.log(err);
    });
});

client.on('message', async message => {
    if(!message.content.startsWith(prefix) || message.author.bot) return;
    const args = message.content.slice(prefix.length).split(/ +/);
    const command = args.shift().toLowerCase();

    switch(command) {
        case 'signup':
            if(args[0] != 'true') {
                var embed = new Discord.MessageEmbed()
                    .setTitle('Terms and Conditions')
                    .setDescription('You must accept the terms and conditions to use BlurplePages.\nType: `"!signup true"` to accept')
                    .setFooter('blurplepages.com/terms');
                message.channel.send(embed);
            } else {
                var req = await Profile.findOne({id: message.author.id});
                if(!req) {
                    var embed = new Discord.MessageEmbed()
                        .setTitle('New Account!')
                        .setDescription('Type: `"!help"` for help with account customization')
                        .setFooter(message.author.username, message.author.displayAvatarURL());
                    message.channel.send(embed);
    
                    const profile = new Profile({
                        id: message.author.id
                    });
                    await profile.save();
                    return;
                } else {
                    var embed = new Discord.MessageEmbed()
                        .setTitle('You already have an account!')
                        .setDescription('Type: `"!help"` for help with account customization')
                        .setFooter(message.author.username, message.author.displayAvatarURL());
                    message.channel.send(embed);
                }
            }
        return;
        case 'age':
            let age = parseInt(args[0]);
            await Profile.findOneAndUpdate({id: message.author.id},{$set: {age: age}},{new: true});
            var embed = new Discord.MessageEmbed()
                .setTitle('Age Added')
                .setDescription(age)
                .setFooter(message.author.username, message.author.displayAvatarURL());
            message.channel.send(embed);
        return;
        case 'country':
            let search = '';
            args.forEach(arg => {
                search += arg + ' ';
            });

            countries.forEach(async(country) => {
                if(country.name.toLowerCase() + ' ' == search.toLowerCase()) {
                    console.log(country.name);
                    await Profile.findOneAndUpdate({id: message.author.id},{$set: {country: country.name}},{new: true});
                    let url = `https://flagpedia.net/data/flags/w580/${lookup.byCountry(country.name).iso2.toLowerCase()}.png`;
                    var embed = new Discord.MessageEmbed()
                        .setTitle('Country Added')
                        .setDescription(country.name)
                        .setThumbnail(url)
                        .setFooter(message.author.username, message.author.displayAvatarURL());
                    message.channel.send(embed);
                }
            });
        return;
        case 'profile':
            if(!args[0]) {
                var req = await Profile.findOne({id: message.author.id})
                var embed = new Discord.MessageEmbed()
                    .setTitle(message.author.username)
                    .setDescription(req.bio)
                    .setThumbnail(message.author.displayAvatarURL())
                    .addField('Age',req.age,true)
                    .addField('Country',`${req.country} :flag_${lookup.byCountry(req.country).iso2.toLowerCase()}:`,true);
                message.channel.send(embed);
            } else {
                if(message.mentions.members.first()) {
                    let mention = message.mentions.members.first();
                    var req = await Profile.findOne({id: mention.id})
                    if(req) {
                        var embed = new Discord.MessageEmbed()
                            .setTitle(mention.user.username)
                            .setDescription(req.bio)
                            .setThumbnail(mention.user.displayAvatarURL())
                            .addField('Age',req.age,true)
                            .addField('Country',`${req.country} :flag_${lookup.byCountry(req.country).iso2.toLowerCase()}:`,true);
                        message.channel.send(embed);
                    } else {
                        var embed = new Discord.MessageEmbed()
                            .setTitle(`${mention.user.username} does not have a BlurplePages account!`)
                            .setDescription('Type: `!signup` to create an account!')
                            .setThumbnail(mention.user.displayAvatarURL())
                        message.channel.send(embed);
                    }
                    
                }   
            }
        return;
        case 'query':
            let profile = await Profile.findOne({id: message.author.id});
            if(!args[0]) {
                let countries = profile.qCountry;
                let age = profile.qAge;
                let cList = '';
                countries.forEach(c => {
                    cList += c+` :flag_${lookup.byCountry(c).iso2.toLowerCase()}:\n`;
                });

                var embed = new Discord.MessageEmbed()
                    .setTitle('Search Query')
                    .setDescription('Type: `!query help` for help!')
                    .addField('Country',cList,true)
                    .addField('Age',`${age[0]}-${age[1]}`,true)
                    .setThumbnail(message.author.displayAvatarURL())
                    .setFooter(message.author.username, message.author.displayAvatarURL());
                message.channel.send(embed);
            } else if(args[0] == 'country') {
                let search = '';
                for(i=1;i<args.length;i++) {
                    search += args[i] + ' ';
                }
                console.log(search);
                countries.forEach(async(country) => {
                    if(country.name.toLowerCase() + ' ' == search.toLowerCase()) { 
                        let countries = profile.qCountry;
                        countries.push(country.name);
                        await Profile.findOneAndUpdate({id: message.author.id},{$set: {qCountry: countries}},{new: true});
                        let url = `https://flagpedia.net/data/flags/w580/${lookup.byCountry(country.name).iso2.toLowerCase()}.png`;
                        var embed = new Discord.MessageEmbed()
                            .setTitle(`${country.name} added to query!`)
                            .setDescription('Type: `!query` to view your whole query')
                            .setThumbnail(url)
                            .setFooter(message.author.username, message.author.displayAvatarURL());
                        message.channel.send(embed);
                    }
                });        
            } else if (args[0] == 'age') {
                var ageRange = args[1];
                var ages = ageRange.split('-');
                ages[0] = parseInt(ages[0]);
                ages[1] = parseInt(ages[1]);
                await Profile.findOneAndUpdate({id: message.author.id},{$set: {qAge: ages}},{new: true});
                var embed = new Discord.MessageEmbed()
                    .setTitle(`Ages ${ages[0]}-${ages[1]} added to query!`)
                    .setDescription('Type: `!query` to view your whole query')
                    .setThumbnail(message.author.displayAvatarURL())
                    .setFooter(message.author.username, message.author.displayAvatarURL());
                message.channel.send(embed);

            } else if(args[0] == 'help') {
                var embed = new Discord.MessageEmbed()
                    .setTitle('Query Help')
                    .setDescription('Commands for search query')
                    .addField('Add Country','`!query country [country_name]`')
                    .addField('Add Age Range','`!query age [min_age]-[max_age]`')
                    .addField('Clear Query','`!query clear`')
                    .setThumbnail(message.author.displayAvatarURL())
                    .setFooter('blurplepages.com', client.user.displayAvatarURL());
                message.channel.send(embed);
            } else if(args[0] == 'clear') {
                await Profile.findOneAndUpdate({id: message.author.id},{$unset: {qCountry: 1}});
                await Profile.findOneAndUpdate({id: message.author.id},{$unset: {qAge: 1}});
                var embed = new Discord.MessageEmbed()
                    .setTitle('Query Cleared')
                    .setFooter(message.author.username, message.author.displayAvatarURL());
                message.channel.send(embed);
            }
        return;
        case 'search':
            searchProfiles(message);
        return;
        case 'bio':
            let bio = args.join(' ');
            await Profile.findOneAndUpdate({id: message.author.id},{$set: {bio: bio}},{new: true});
            var embed = new Discord.MessageEmbed()
                .setTitle('Bio Added')
                .setDescription(bio)
                .setThumbnail(message.author.displayAvatarURL())
                .setFooter(message.author.username, message.author.displayAvatarURL());
            message.channel.send(embed);
        return;
        case 'help':
            var embed = new Discord.MessageEmbed()
                .setTitle('BlurplePages Help')
                .addField('Set Age','`!age [your_age]`')
                .addField('Set Country','`!country [your_country]`')
                .addField('Set Bio','`!bio [your_bio]`')
                .addField('Search','`!search`')
                .addField('Customize Search Query','`!query help`')
                .addField('View Profile','`!profile [@user]` -- Leave @user blank for yourself')
                .setThumbnail(message.author.displayAvatarURL())
                .setFooter('blurplepages.com', client.user.displayAvatarURL());
            message.channel.send(embed);
        return;
        default:
            var embed = new Discord.MessageEmbed()
                .setTitle('Not a valid command')
                .setDescription('Type: `!help` for the command list')
                .setFooter(message.author.username, message.author.displayAvatarURL());
            message.channel.send(embed);
    }
});    

client.login(config.token);