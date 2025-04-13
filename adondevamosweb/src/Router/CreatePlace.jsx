import { useState } from 'react';
import axios from 'axios';

function CreatePlace() {
  // placeinfo
  const [formCreatePlace, setformCreatePlace] = useState({
    name: '',
    countryID: '',
    stateID: '',
    cityID: '',
    description: '',
    address:'',
    facilities:[],
    isInternational: false
  });

  // UI state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [submitSuccess, setSubmitSuccess] = useState(false);

  // Handle form field changes
  const handleChange = (e) => {
    const { name, countryID, stateID, cityID, description, address, facilities, isInt } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError('');
    setSubmitSuccess(false);

    try {
      // Validate for field PlaceName
      if (!formCreatePlace.name.trim()) {
        throw new Error('Place name is required');
      }
      // Validate for field Description
      if (!formCreatePlace.description.trim()) {
        throw new Error('Place description is required');
      }
      // Validate for field Address
      if (!formCreatePlace.address.trim()) {
        throw new Error('Place address is required');
      }
      // Validate for field Country
      if (!formCreatePlace.countryID != null) {
        throw new Error('CountryID is required');
      }

      // Validate for field State
      if (!formCreatePlace.stateID != null) {
        throw new Error('StateID is required');
      }

      // Validate for field City
      if (!formCreatePlace.cityID != null) {
        throw new Error('cityID is required');
      }
      // Validate for field City
      if (!formCreatePlace.itinerary != null) {
        throw new Error('select at least one place is required');
      }
      

      // API call to create product
      const response = await axios.post('http://localhost/CreatePlace', {
        name: formCreatePlace.name.trim(),
        countryID: formCreatePlace.countryID,
        stateID: formCreatePlace.stateID,
        cityID: formCreatePlace.cityID,
        description: formCreatePlace.description,
        address:formCreatePlace.address,
        facilities:formCreatePlace.facilities,
        isInternational: formCreatePlace.isInternational
      }, {
        headers: {
          'Content-Type': 'application/json',
          // 'Authorization': 'Bearer your-token-here' // Add if needed
        }
      });

      // Handle success
      setSubmitSuccess(true);
      console.log('Place created:', response.data);
      
      // Reset form after successful submission
      setformCreatePlace({
        name: '',
        countryID: '',
        stateID: '',
        cityID: '',
        description: '',
        address:'',
        facilities:[],
        isInternational: false
      });
      
    } catch (error) {
      setSubmitError(error.response?.data?.message || error.message);
      console.error('Error creating place:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="place-form-container">
      <h2>Create Place</h2>
      
      {submitSuccess && (
        <div className="alert alert-success">
          Place created successfully!
        </div>
      )}
      
      {submitError && (
        <div className="alert alert-error">
          Error: {submitError}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="name">Place Name*</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formCreatePlace.name}
            onChange={handleChange}
            required
            placeholder="Enter product name"
          />
        </div>

        <div className="form-group">
          <label htmlFor="country">Country</label>
          <select
            id="country"
            name="country"
            value={formCreatePlace.country}
            onChange={handleChange}
          >
            <option value="1">Mexico</option>
            <option value="2">Japan</option>
            <option value="3">USA</option>
            <option value="4">Canada</option>
            <option value="5">Peru</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="state">State</label>
          <select
            id="state"
            name="state"
            value={formCreatePlace.state}
            onChange={handleChange}
          >
            <option value="1">Sinaloa</option>
            <option value="2">Jalisco</option>
            <option value="3">California</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="city">City</label>
          <select
            id="city"
            name="city"
            value={formCreatePlace.city}
            onChange={handleChange}
          >
            <option value="1">Cancun</option>
            <option value="2">Culiacan</option>
            <option value="3">Osaka</option>
            <option value="4">Tokio</option>
            <option value="5">Hiroshima</option>
            <option value="6">Otro</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="description">Description</label>
          <textarea
            id="description"
            name="description"
            value={formCreatePlace.description}
            onChange={handleChange}
            rows="4"
            placeholder="Enter place description"
          />
        </div>

        <div className="form-group checkbox-group">
          <input
            type="checkbox"
            id="isInt"
            name="isInternational"
            checked={formData.isInternational}
            onChange={handleChange}
          />
          <label htmlFor="inStock">Is international?</label>
        </div>

        <div className="form-group checkbox-group">
          
          <label htmlFor="facilityID">Faciliti list</label>
        </div>

        <button 
          type="submit" 
          disabled={isSubmitting}
          className="submit-button"
        >
          {isSubmitting ? 'Creating...' : 'Create Place'}
        </button>
      </form>
    </div>
  );
};

export default CreatePlace;