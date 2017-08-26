require 'grape'
require 'grape-swagger'

class WordPressHotelApi < Grape::API
  content_type :json, 'application/json'

  default_format :json
  format :json

  rescue_from :all do |error_object|
   ErrorManagement.rack_error_capture(error_object)
  end

  desc 'Search hotels POSTGRES'
  params do
    requires :term, type: String
  end
  get '/search' do
    Hotel.where(hotel_status: 'active')
      .where('name LIKE ?', "%#{params[:term]}%").limit(10)
      .map{|r| HotelSerializer.new(r).serializable_hash(include: '**')}
  end

  desc 'Search hotels MONGO'
  params do
    requires :term, type: String
  end
  get '/search/mongo' do
    begin
      Hotel.where(hotel_status: 'active', :name => /.*#{params[:term]}.*/i ).limit(10)
        .map{|r| HotelSerializer.new(r).serializable_hash(include: '**')}
    rescue
      {message: "This is a mongo endpoint and mongo DB probably no longer exists."}
    end

  end

  desc 'get hotel'
  get '/:id' do
    hotel = Hotel.where(id: params[:id]).first
    if hotel.present?
      return HotelSerializer.new(hotel).serializable_hash(include: '**')
    else
      return nil
    end
  end
end
