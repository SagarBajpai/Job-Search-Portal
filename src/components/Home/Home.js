import React, { Component } from 'react';
import axios from 'axios';
import './Home.css';
import data from '../assets/Data.json';
import locationList from "../assets/location";
import experienceList from "../assets/experience";
import Dropdown from '../Dropdown/Dropdown';
import SearchBar from '../SearchBar/SearchBar';
import JobCards from '../JobCards/JobCards';

class Home extends Component {
    constructor(props){
        super(props);
        this.state={
            data:null,
            selectedLocation:'--Any--',
            selectedExperience: '--Any--',
            keywords: ''        
        };
    }
    componentDidMount=()=>{
        this.fetchData();
    }

    fetchData=()=>{
        // axios.get('https://jobsqared.herokuapp.com/jobs').then((res)=>{
        //     console.log('res : ', res);
        // });
        this.setState({
            data: data.data
        });   
    }  
    
    handleExperience=(e)=>{
        let value = e.label;
        this.setState({
            selectedExperience: value,
        },()=>{
            console.log('experience : ', this.state.selectedExperience)
        });
    }

    handleLocation=(e)=>{
        let value = e.label;
        this.setState({
            selectedLocation: value,
        },()=>{
            console.log('location : ', this.state.selectedLocation)
        });
    }
    handleKeywords=(e)=>{
        console.log('Keywords : ', e.target.value)
        let value = e.target.value;
        this.setState({
            keywords: value
        },()=>{
            console.log('keywords : ', this.state.keywords)
        });
    }

    filter=(job)=>{
        const { selectedExperience, selectedLocation } = this.state;
        //Only experience filter
        if(selectedExperience.toString() != '--Any--' && selectedExperience.toString()!='' && selectedLocation == '--Any--'){
            if(this.experienceFilter(job)){
                return true;
            };
         //only location filter   
        }else if((selectedLocation.toString() != '--Any--') && (selectedExperience.toString() == '--Any--')){
           if(this.locationFilter(job)){
               return true
           }
        //Both filters location and experience togerther
        }else if((selectedLocation.toString() != '--Any--')&&(selectedExperience.toString() != '--Any--')){
            if(this.experienceFilter(job) && this.locationFilter(job)){
                return true;
            }
        }
    }

    experienceFilter=(job)=>{
        console.log('experienceFilter')
        const { selectedExperience, selectedLocation } = this.state;
        if(job.experience !='' && job.experience !=null && job.experience != 'Fresher' && job.experience != 'Freshers'){
            let temp = job.experience.trim().substring(0,job.experience.lastIndexOf(' '));
            let exp = temp.match(/\d/g);
                if(exp.length == 1){
                    if(+(exp[0])==selectedExperience)
                    return true   
                }else if(exp.length == 2){
                    if(+(exp[0]+exp[1])==selectedExperience)
                    return true   
                }else if(exp.length==3){
                    if(+(exp[0])<=selectedExperience && selectedExperience <= +(exp[1]+exp[2])){
                        return true
                    }
                }else if(exp.length==4){
                    if(+(exp[0]+exp[1]) <=selectedExperience && selectedExperience <= +(exp[2]+exp[3])){
                        return true
                    }
                }
        }else if(job.experience == 'Fresher' || job.experience == 'Freshers'){
            if(selectedExperience == 'Fresher')
            return true   
        }
    }

    locationFilter=(job)=>{
        const { selectedLocation } = this.state;
        if(job.location.toLowerCase().indexOf(selectedLocation.toLowerCase())>-1){
            return true
        }
    }

    keywordsFilter=()=>{
        const {keywords} =this.state;
        var title = document.querySelectorAll('._title');
        title.forEach(function(item){
            console.log(item.innerText);
        });
        title.forEach(function(item){
            if((item.innerText).toLowerCase().indexOf(keywords)==-1){
                item.parentElement.style.display='none'
            };
        })
    }

    render() {
        const { data, selectedExperience, selectedLocation, keywords  } = this.state;
        let Jobs;
        if(data!=undefined){
            Jobs =  data.map((job, index)=>{
                    if((selectedExperience.toString()) != '--Any--' || (selectedLocation != '--Any--')){
                        if(this.filter(job)){
                            return  <JobCards 
                            companyname={job.companyname}
                            title={job.title}
                            experience ={job.experience}
                            location={job.location}
                            salary={job.salary.trim() || undefined}
                            skills={job.skills}
                            startdate={job.startdate  || undefined}
                            type={job.type  || undefined}
                            applylink={job.applylink || '#'}
                            />
                        }
                    }else{
                        return  <JobCards 
                        companyname={job.companyname}
                        title={job.title}
                        experience ={job.experience}
                        location={job.location}
                        salary={job.salary.trim() || undefined}
                        skills={job.skills}
                        startdate={job.startdate  || undefined}
                        type={job.type  || undefined}
                        applylink={job.applylink || '#'}
                        />
                    }
                });
            }
        if(keywords!=''){
            this.keywordsFilter();
        }
        return (
            <div>
                <div className="top_search_area">
                    <div className="_row">
                        <div>
                            <p>Experience :</p>
                            <div className="">
                                <Dropdown 
                                    values={experienceList}
                                    onChange={this.handleExperience}
                                />
                            </div>
                        </div>
                    </div>
                    <div className="_row">
                        <div>
                            <p>Location :</p>
                            <div className="">
                                <Dropdown 
                                    values={locationList}
                                    onChange={this.handleLocation}
                                />
                            </div>
                        </div>
                    </div>
                    <div className="search_button">
                        <button className="btn btn-danger">Search</button>
                    </div>
                </div>

                <div className="middle_filter_area">
                    <div className="_row">
                        <div>
                            <p>Search by :</p>
                            <div className="">
                                <SearchBar 
                                    values={experienceList}
                                    onChange={this.handleKeywords}
                                    placeholder={'Skills or Designation or Companies'}
                                />
                            </div>
                        </div>
                    </div>
                </div>
                <div className="jobs_shell">
                    {Jobs}
                </div>
            </div>
        );
    }
}

export default Home;