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
            keywords: '',
            sortByLocation: false,
            sortByExperience: false,
            jobsObj : [],      
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
        });
    }

    handleLocation=(e)=>{
        let value = e.label;
        this.setState({
            selectedLocation: value,
        });
    }
    handleKeywords=(e)=>{
        let value = e.target.value;
        this.setState({
            keywords: value
        });
    }

    filter=(job)=>{
        const { selectedExperience, selectedLocation, keywords } = this.state;
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
        const { selectedExperience, keywords } = this.state;
        if(job.experience !='' && job.experience !=null && job.experience != 'Fresher' && job.experience != 'Freshers'){
            let str = job.experience.trim().substring(0,job.experience.trim().lastIndexOf(' '));
            let firstNumber, secondNumber;
            if(str.includes('to')){
                firstNumber = +(str.slice(0,str.indexOf('to')).trim());
                secondNumber = +(str.slice(str.indexOf('o')+1, str.length))
                if(firstNumber<=selectedExperience && selectedExperience<=secondNumber){
                    if(keywords!=''){
                        if(this.matchKeyword(job)){
                            return true
                        }else{return false}
                    }
                    return true
                }
            }else
            if(str.includes('-')){
                firstNumber = +(str.slice(0,str.indexOf('-')).trim());
                secondNumber = +(str.slice(str.indexOf('-')+1, str.length))
                if(firstNumber<=selectedExperience && selectedExperience<=secondNumber){
                    if(keywords!=''){
                        if(this.matchKeyword(job)){
                            return true
                        }else{return false}
                    }
                    return true
                }
            }else{
                if(str == selectedExperience){
                    if(keywords!=''){
                        if(this.matchKeyword(job)){
                            return true
                        }else{return false}
                    }
                    return true
                }
            }
        }else if(job.experience == 'Fresher' || job.experience == 'Freshers'){
            if(selectedExperience == 'Fresher'){
                if(keywords!=''){
                    if(this.matchKeyword(job)){
                        return true
                    }else{return false}
                }
                return true
            }
        }
    }

    locationFilter=(job)=>{
        // console.log('locationFilter')
        const { selectedLocation, keywords } = this.state;
        if(job.location.toLowerCase().indexOf(selectedLocation.toLowerCase())>-1){
            if(keywords!=''){
                if(this.matchKeyword(job)){
                    return true
                }else{return false}
            }
            return true
        }
    }

    keywordsFilter=()=>{
        if(this.locationFilter() && this.experienceFilter()){
            return true
        }
    }
    matchKeyword=(job)=>{
        const {keywords} = this.state;
        if(job.title.toLowerCase().indexOf(keywords.toLowerCase())>-1
            || job.companyname.toLowerCase().indexOf(keywords.toLowerCase())>-1
            || job.skills.toLowerCase().indexOf(keywords.toLowerCase())>-1
        ){
            return true
        }
    }

    handleSort=(sort)=>{
        if(sort=='sortByExperience'){
            this.setState({
                sortByExperience: !this.state.sortByExperience,
                sortByLocation: false
            });
        }else{
            this.setState({
                sortByLocation: !this.state.sortByLocation,
                sortByExperience: false,
            });
        };
    }

    sortingAlgo=(jobsObj, sortBy)=>{
        var sorted = jobsObj.slice(0);
        sorted.sort(function(a,b) {
            var x = a[sortBy].toLowerCase();
            var y = b[sortBy].toLowerCase();
            return x < y ? -1 : x > y ? 1 : 0;
        });
        this.state.jobsObj=[]
        return sorted;
    }

    sortedJob=(job, flag)=>{
        const { jobsObj, sortByLocation } = this.state;
        if(!flag){
            let element={};
            element.companyname=job.companyname;
            element.title=job.title;
            element.experience =job.experience;
            element.location=job.location;
            element.salary=job.salary.trim() || undefined;
            element.skills=job.skills;
            element.startdate=job.startdate  || undefined;
            element.type=job.type  || undefined;
            element.applylink=job.applylink || '#'
            
            jobsObj.push(element);
        }else if(flag){
            if(sortByLocation){
               return this.sortingAlgo(jobsObj,'location')
            }else{
               return this.sortingAlgo(jobsObj,'experience')
            }
        }
    }

    render() {
        const { data, selectedExperience, selectedLocation, keywords, sortByExperience, sortByLocation  } = this.state;
        let Jobs, sortedJob, totalResults=0;
        if(data!=undefined){
            Jobs =  data.map((job, index)=>{
                    if((selectedExperience.toString()) != '--Any--' || (selectedLocation != '--Any--')){
                        if(this.filter(job)){
                            totalResults++;

                            if(sortByLocation || sortByExperience){
                                this.sortedJob(job,0);
                                return
                            }
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
                        totalResults++;
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
        if(sortByLocation || sortByExperience){
            console.log('inside sort')
            sortedJob = this.sortedJob('',1);
            Jobs =  sortedJob.map((job, index)=>{
                return  <JobCards 
                companyname={job.companyname}
                title={job.title}
                experience ={job.experience}
                location={job.location}
                salary={job.salary || undefined}
                skills={job.skills}
                startdate={job.startdate  || undefined}
                type={job.type  || undefined}
                applylink={job.applylink || '#'}
                />
            });
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
                </div>
                {(selectedLocation !== '--Any--' || selectedExperience !== '--Any--') && 
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
                        <div className="sort_button">
                            <div>
                                <p>Sort By </p>
                                <button className="btn" onClick={()=>this.handleSort('sortByLocation')} >Location</button>
                                <button className="btn" onClick={()=>this.handleSort('sortByExperience')} >Experience</button>
                            </div>
                        </div>
                    </div>
                }
                <div className="total_results">
                    <p>Total Jobs Found : {totalResults}</p>
                </div>
                <div className="jobs_shell">
                    {totalResults != 0 ? Jobs : 
                    <p className='no_job'>Oops! No Job Found.</p>
                    }
                </div>
            </div>
        );
    }
}

export default Home;