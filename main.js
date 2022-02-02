const Discord = require('discord.js');
const client = new Discord.Client();
const config = require('./config.json');
const prefix = config.prefix;
const mongoose = require('mongoose');
const Profile = require('./models/profileSchema');
const lookup = require('country-code-lookup');
const countries = require('./countries.json');

function getRandomInt(max) {
    return Math.floor(Math.random()*max);
}

async function searchProfiles(message) {
    let sender = await Profile.findOne({id: message.author.id});
    let results = await Profile.find();


    filled = true;
    notFilledList = [];
    if(sender.qCountry[0] == undefined) {
        filled = false;
        notFilledList.push('country');
    }
    if(sender.qAge[0] == undefined) {
        filled = false;
        notFilledList.push('age');
    }
    if(!filled) {
        var embed = new Discord.MessageEmbed()
            .setTitle(`Missing Query Information`)
            .setDescription('Missing: `['+notFilledList+']`\nType: `!query help` for help')
            .setFooter(message.author.username, message.author.displayAvatarURL());
        message.channel.send(embed);
        return;
    }

    let query = {
        qCountry: sender.qCountry,
        qAge: sender.qAge
    }
    console.log(query);
    var i = 0;
    let matches = [];
    while(i<results.length) {
        let profile = await client.users.fetch(results[i].id).catch(console.error);
        let req = await Profile.findOne({id: profile.id});

        if(query.qAge[0] <= req.age && query.qAge[1] >= req.age) {
            for(j=0;j<query.qCountry.length;j++) {
                if(req.country == query.qCountry[j]) {
                    console.log(`${profile.username} fits your query!`)
                    matches.push(profile);

                    if(i+1 == results.length) {
                        // finished loop
                        profile = matches[getRandomInt(matches.length)];
                        profile.send(`**${message.author.username}#${message.author.discriminator}** matched to your BlurplePages account on **${message.guild.name}**`);
                        
                        var embed = new Discord.MessageEmbed()
                            .setTitle(`${profile.username}#${profile.discriminator}`)
                            .setDescription(`Send a message to ${profile.username}, they fit your search query!`)
                            .addField('Age',req.age,true)
                            .addField('Country',`${req.country} :flag_${lookup.byCountry(req.country).iso2.toLowerCase()}:`,true)
                            .setThumbnail(profile.displayAvatarURL())
                            .setFooter(message.author.username, message.author.displayAvatarURL());
                        message.channel.send(embed);
                    }
                }
            }
            console.log('Not a query match. Onto next profile!');
            i++;
        } else {
            console.log('Not in age range!');
            i++;
        }
    }
    if(matches[0] == undefined) {
        console.log('There are no matches :(');
        var embed = new Discord.MessageEmbed()
            .setTitle('Found no matches! :(')
            .setDescription('Try widening your search query for better results')
            .setFooter(message.author.username, message.author.displayAvatarURL());
        message.channel.send(embed);
    }
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
                var req = await Profile.findOne({id: message.author.id});
                if(!req) {
                    var embed = new Discord.MessageEmbed()
                        .setTitle('Terms and Conditions')
                        .setDescription('You must accept the terms and conditions to use BlurplePages.\nType: `"!signup true"` to accept')
                        .setFooter('blurplepages.com/terms', client.user.displayAvatarURL());
                    message.channel.send(embed);
                } else {
                    var embed = new Discord.MessageEmbed()
                        .setTitle('You already have an account!')
                        .setDescription('Type: `"!help"` for help with account customization')
                        .setFooter(message.author.username, message.author.displayAvatarURL());
                    message.channel.send(embed);
                }
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
            let search = args.join(' ');
            console.log(search);
            var found;
            countries.forEach(async(country) => {
                if(country.name.toLowerCase() == search.toLowerCase()) {
                    found = true;
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
            if(!found) {
                var embed = new Discord.MessageEmbed()
                    .setTitle(`${search} is not a valid country name!`)
                    .setDescription('Visit the [country list](https://github.com/jackgimre/blurplepages/blob/main/countries.json) for the list of countries')
                    .setThumbnail(message.author.displayAvatarURL())
                    .setFooter(message.author.username, message.author.displayAvatarURL());
                message.channel.send(embed);
            } 
        return;
        case 'profile':
            if(!args[0]) {
                var req = await Profile.findOne({id: message.author.id})
                if(!req) {
                    var embed = new Discord.MessageEmbed()
                        .setTitle('You do not have a BlurplePages account!')
                        .setDescription('Type: `"!signup"` to create an account!')
                        .setThumbnail(message.author.displayAvatarURL())
                    message.channel.send(embed);
                    return;
                }
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
                            .setDescription('Type: `"!signup"` to create an account!')
                            .setThumbnail(mention.user.displayAvatarURL())
                        message.channel.send(embed);
                    }
                }   
            }
        return;
        case 'query':case 'q':
            let profile = await Profile.findOne({id: message.author.id});
            if(!args[0]) {
                let countries = profile.qCountry;
                let age = profile.qAge;
                filled = true;
                notFilledList = [];
                if(countries[0] == undefined) {
                    filled = false;
                    notFilledList.push('country');
                }
                if(age[0] == undefined) {
                    filled = false;
                    notFilledList.push('age');
                }
                if(!filled) {
                    var embed = new Discord.MessageEmbed()
                        .setTitle(`Missing Query Information`)
                        .setDescription('Missing: `['+notFilledList+']`\nType: `!query help` for help')
                        .setFooter(message.author.username, message.author.displayAvatarURL());
                    message.channel.send(embed);
                    return;
                }
                let cList = '';
                countries.forEach(c => {
                    cList += c+` :flag_${lookup.byCountry(c).iso2.toLowerCase()}:\n`;
                });

                var embed = new Discord.MessageEmbed()
                    .setTitle('Search Query')
                    .setDescription('Type: `"!query help"` for help!')
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
                var found = false;
                countries.forEach(async(country) => {
                    if(country.name.toLowerCase() + ' ' == search.toLowerCase()) { 
                        found = true
                        let countries = profile.qCountry;
                        countries.push(country.name);
                        await Profile.findOneAndUpdate({id: message.author.id},{$set: {qCountry: countries}},{new: true});
                        let url = `https://flagpedia.net/data/flags/w580/${lookup.byCountry(country.name).iso2.toLowerCase()}.png`;
                        var embed = new Discord.MessageEmbed()
                            .setTitle(`${country.name} added to query!`)
                            .setDescription('Type: `"!query"` to view your whole query')
                            .setThumbnail(url)
                            .setFooter(message.author.username, message.author.displayAvatarURL());
                        message.channel.send(embed);
                    }
                });  
                if(!found) {
                    var embed = new Discord.MessageEmbed()
                        .setTitle(`${search}is not a valid country name!`)
                        .setDescription('Visit the [country list](https://github.com/jackgimre/blurplepages/blob/main/countries.json) for the list of countries')
                        .setFooter(message.author.username, message.author.displayAvatarURL());
                    message.channel.send(embed); 
                }  
            } else if (args[0] == 'age') {
                var ageRange = args[1];
                if(ageRange == undefined) {
                    var embed = new Discord.MessageEmbed()
                        .setTitle('Incorrect Query Syntax')
                        .setDescription('Type: `"!query help"` for help')
                        .setThumbnail(message.author.displayAvatarURL())
                        .setFooter(message.author.username, message.author.displayAvatarURL());
                    message.channel.send(embed);
                } else {
                    var ages = ageRange.split('-');
                    ages[0] = parseInt(ages[0]);
                    ages[1] = parseInt(ages[1]);
                    await Profile.findOneAndUpdate({id: message.author.id},{$set: {qAge: ages}},{new: true});
                    var embed = new Discord.MessageEmbed()
                        .setTitle(`Ages ${ages[0]}-${ages[1]} added to query!`)
                        .setDescription('Type: `"!query"` to view your whole query')
                        .setThumbnail(message.author.displayAvatarURL())
                        .setFooter(message.author.username, message.author.displayAvatarURL());
                    message.channel.send(embed);
                }
            
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
                    .setDescription('Type: `!query help` for help!')
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
        case 'delete':
            if(args[0] == 'true') {
                await Profile.findOneAndDelete({id: message.author.id});
                var embed = new Discord.MessageEmbed()
                    .setTitle('Account Deleted!')
                    .setDescription("We're sad to see you go! :(")
                    .setThumbnail(message.author.displayAvatarURL())
                    .setFooter(message.author.username, message.author.displayAvatarURL());
                message.channel.send(embed);
            } else {
                var embed = new Discord.MessageEmbed()
                    .setTitle('Are you sure?')
                    .setDescription('Type: `"!delete true"` if you really want to permanently delete your account')
                    .setThumbnail(message.author.displayAvatarURL())
                    .setFooter(message.author.username, message.author.displayAvatarURL());
                message.channel.send(embed);
            }
            

        return;
        case 'help':
            var embed = new Discord.MessageEmbed()
                .setTitle('BlurplePages Help')
                .addField('Signup','`!signup` -- Must agree to TOS to signup')
                .addField('Set Age','`!age [your_age]`')
                .addField('Set Country','`!country [your_country]`')
                .addField('Set Bio','`!bio [your_bio]`')
                .addField('Search','`!search`')
                .addField('Customize Search Query','`!query help`')
                .addField('View Profile','`!profile [@user]` -- Leave @user blank for yourself')
                .addField('Delete Account','`!delete`')
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
        return;
    }
});    

client.login(config.token);